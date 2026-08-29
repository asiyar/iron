import { COOKIE_NAME } from "../shared/const";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

const recommendationInput = z.object({
  completedWorkouts: z.number().int().min(0),
  totalVolume: z.number().min(0),
  personalRecordCount: z.number().int().min(0),
  topMuscles: z.array(z.string()).max(5),
  latestWeight: z.number().positive().optional(),
  stepsToday: z.number().int().min(0).optional(),
});

function fallbackRecommendation(input: z.infer<typeof recommendationInput>) {
  const nextFocus = input.completedWorkouts === 0 ? "İlk antrenman kaydını oluştur" : input.personalRecordCount === 0 ? "Teknik kalitesini sabitle" : "Kademeli yüklenmeyi izle";
  return {
    headline: nextFocus,
    summary: input.completedWorkouts === 0 ? "Öneri oluşturmak için en az bir tamamlanmış antrenman gerekir." : `${input.completedWorkouts} tamamlanmış antrenmana göre, bir sonraki seansta sürdürülebilir ilerlemeye odaklan.`,
    actions: ["Bir sonraki antrenmanda ana hareket için hedef tekrar aralığını koru.", "Setler form bozulmadan tamamlanıyorsa küçük bir ağırlık artışını değerlendir.", "Ağrı veya alışılmadık rahatsızlıkta antrenmanı durdur ve uygun bir uzmana danış."],
    caution: "Bu öneri antrenman planlama amaçlıdır; tıbbi tavsiye değildir.",
  };
}

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  community: router({
    publicList: publicProcedure.query(() => db.listPublicCoachPrograms()),
    byCode: publicProcedure.input(z.object({ shareCode: z.string().min(6).max(32) })).query(({ input }) => db.getCoachProgramByShareCode(input.shareCode)),
    mine: protectedProcedure.query(({ ctx }) => db.listCoachProgramsByAuthor(ctx.user.id)),
    publish: protectedProcedure.input(z.object({
      title: z.string().trim().min(3).max(160),
      summary: z.string().trim().min(12).max(1000),
      goal: z.string().trim().min(2).max(120),
      visibility: z.enum(["private_link", "public"]),
      templateJson: z.string().min(2).max(50000),
    })).mutation(async ({ ctx, input }) => {
      const shareCode = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
      const id = await db.createCoachProgram({ authorId: ctx.user.id, ...input, shareCode });
      return { id, shareCode };
    }),
  }),
  ai: router({
    recommend: protectedProcedure.input(recommendationInput).mutation(async ({ ctx, input }) => {
      const fallback = fallbackRecommendation(input);
      try {
        const { data: models } = await listLLMModels();
        const model = models.find((item) => item.id === "gpt-5-mini")?.id ?? models[0]?.id;
        const response = await invokeLLM({
          model,
          messages: [
            { role: "system", content: "Sen deneyimli, güvenlik odaklı bir güç antrenmanı koçusun. Tıbbi teşhis koyma; sakatlık, ağrı, hastalık, takviye veya beslenme tedavisi önerme. Yanıtı yalnızca JSON olarak ver: {headline:string,summary:string,actions:string[],caution:string}. Actions dizisi tam üç somut antrenman adımı içersin. Kullanıcının sağladığı özet dışındaki verileri varsayma." },
            { role: "user", content: `Bu antrenman özetini değerlendir: ${JSON.stringify(input)}` },
          ],
          response_format: { type: "json_object" },
        });
        const content = response.choices[0]?.message.content;
        const parsed = typeof content === "string" ? JSON.parse(content) : fallback;
        const valid = typeof parsed?.headline === "string" && typeof parsed?.summary === "string" && Array.isArray(parsed?.actions);
        const recommendation = valid ? parsed : fallback;
        await db.saveAiRecommendation(ctx.user.id, Buffer.from(JSON.stringify(input)).toString("base64").slice(0, 64), JSON.stringify(recommendation));
        return recommendation;
      } catch {
        return fallback;
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
