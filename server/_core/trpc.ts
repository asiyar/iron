import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const router = t.router;
export const middleware = t.middleware;

/** Oturum gerektirmeyen uçlar. */
export const publicProcedure = t.procedure;

/** Oturum zorunlu uçlar — `ctx.user` daraltılmış olarak gelir. */
export const protectedProcedure = t.procedure.use(
  middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Bu işlem için giriş yapmalısın." });
    return next({ ctx: { ...ctx, user: ctx.user } });
  }),
);
