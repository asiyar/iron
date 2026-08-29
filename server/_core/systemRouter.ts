import { z } from "zod";

import { ENV } from "./env";
import { protectedProcedure, publicProcedure, router } from "./trpc";

/** Framework seviyesi yardımcı uçlar (sağlık kontrolü, sahip bildirimi). */
export const systemRouter = router({
  health: publicProcedure.query(() => ({ ok: true, at: new Date().toISOString() })),
  notifyOwner: protectedProcedure
    .input(z.object({ title: z.string().min(1).max(200), content: z.string().min(1).max(4000) }))
    .mutation(async ({ input }) => {
      if (!ENV.ownerOpenId) return { delivered: false as const, reason: "OWNER_OPEN_ID tanımlı değil." };
      console.info("[notifyOwner]", input.title, input.content);
      return { delivered: true as const };
    }),
});
