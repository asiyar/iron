import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type SessionUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: Date;
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: SessionUser | null;
};

/**
 * İstek başına bağlam üretir.
 * Oturum çözümlemesi burada yapılır; token yoksa `user` null kalır.
 */
export async function createContext({ req, res }: CreateExpressContextOptions): Promise<TrpcContext> {
  return { req, res, user: (req as { user?: SessionUser }).user ?? null };
}
