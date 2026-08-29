/**
 * Sunucu tarafı ortam değişkenleri.
 * Bu dosya framework seviyesindedir; yeni değişken eklerken .env.example'ı da güncelle.
 */
export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  llmBaseUrl: process.env.LLM_BASE_URL ?? "",
  llmApiKey: process.env.LLM_API_KEY ?? "",
  appId: process.env.APP_ID ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  oauthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
};
