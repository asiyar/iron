import { getApiBaseUrl } from "@/constants/oauth";
import { getSessionToken } from "@/lib/_core/auth";

type ApiUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: string;
};

async function authorizedHeaders(): Promise<Record<string, string>> {
  const token = await getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Oturum açmış kullanıcıyı döner; oturum yoksa null. */
export async function getMe(): Promise<ApiUser | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      credentials: "include",
      headers: await authorizedHeaders(),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { user?: ApiUser } | ApiUser | null;
    if (!payload) return null;
    return "user" in (payload as Record<string, unknown>) ? ((payload as { user?: ApiUser }).user ?? null) : (payload as ApiUser);
  } catch {
    return null;
  }
}

/** Sunucu tarafındaki oturum çerezini temizler. */
export async function logout(): Promise<void> {
  await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: await authorizedHeaders(),
  });
}
