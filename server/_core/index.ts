import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import express from "express";

import { appRouter } from "../routers";
import { createContext } from "./context";
import { ENV } from "./env";

/**
 * Backend giriş noktası.
 * Tüm uçlar "/api/" ile başlar; gateway yönlendirmesi buna göre yapılır.
 * Socket.io gibi ek servisleri de burada kaydet.
 */
export function createServer() {
  const app = express();

  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, env: ENV.nodeEnv });
  });

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  createServer().listen(port, () => console.log(`[IronPulse] API http://localhost:${port}`));
}
