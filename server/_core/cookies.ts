import type { Request } from "express";

import { ENV } from "./env";

export type SessionCookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "none";
  path: string;
  maxAge: number;
  domain?: string;
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Oturum çerezi seçeneklerini üretir; cross-site istekte SameSite=None gerekir. */
export function getSessionCookieOptions(req?: Request): SessionCookieOptions {
  const forwardedProto = req?.headers["x-forwarded-proto"];
  const secure = ENV.isProduction || forwardedProto === "https";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: THIRTY_DAYS_MS,
  };
}
