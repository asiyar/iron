import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";

type UseAuthOptions = { autoFetch?: boolean };

/**
 * Oturum durumunu okur.
 * Web: çerez tabanlı, kullanıcıyı API'den çeker.
 * Native: token tabanlı, kullanıcı bilgisi SecureStore'da önbelleklenir.
 */
export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<Auth.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === "web") {
        const apiUser = await Api.getMe();
        if (apiUser) {
          const userInfo: Auth.User = {
            id: apiUser.id,
            openId: apiUser.openId,
            name: apiUser.name,
            email: apiUser.email,
            loginMethod: apiUser.loginMethod,
            lastSignedIn: new Date(apiUser.lastSignedIn),
          };
          setUser(userInfo);
          await Auth.setUserInfo(userInfo);
        } else {
          setUser(null);
          await Auth.clearUserInfo();
        }
        return;
      }

      const sessionToken = await Auth.getSessionToken();
      if (!sessionToken) {
        setUser(null);
        return;
      }
      setUser(await Auth.getUserInfo());
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Kullanıcı bilgisi alınamadı"));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Api.logout();
    } catch {
      // Sunucu erişilemese bile yerel oturumu temizle.
    } finally {
      await Auth.removeSessionToken();
      await Auth.clearUserInfo();
      setUser(null);
      setError(null);
    }
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    if (!autoFetch) {
      // Otomatik çekim kapalıysa yükleme durumunu bir sonraki tick'te bırak;
      // effect gövdesinde senkron setState cascading render tetikler.
      const handle = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(handle);
    }
    // Mount'ta veri çekme: setState asenkron olarak, istek döndükten sonra çağrılır.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kasıtlı veri çekme akışı
    void fetchUser();
  }, [autoFetch, fetchUser]);

  return { user, loading, error, isAuthenticated, refresh: fetchUser, logout };
}
