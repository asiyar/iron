import { ENV } from "./env";

export type LLMMessage = { role: "system" | "user" | "assistant"; content: string };

export type LLMRequest = {
  model?: string;
  messages: LLMMessage[];
  response_format?: { type: "json_object" | "text" };
  temperature?: number;
};

export type LLMResponse = {
  choices: { message: { role: string; content: string | null } }[];
};

export type LLMModelList = { data: { id: string; name?: string }[] };

function assertConfigured() {
  if (!ENV.llmBaseUrl || !ENV.llmApiKey) {
    throw new Error("LLM_BASE_URL ve LLM_API_KEY tanımlı değil.");
  }
}

/** OpenAI uyumlu chat/completions çağrısı. */
export async function invokeLLM(request: LLMRequest): Promise<LLMResponse> {
  assertConfigured();
  const response = await fetch(`${ENV.llmBaseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ENV.llmApiKey}` },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`LLM isteği başarısız: ${response.status}`);
  return (await response.json()) as LLMResponse;
}

/** Kullanılabilir modelleri listeler. */
export async function listLLMModels(): Promise<LLMModelList> {
  assertConfigured();
  const response = await fetch(`${ENV.llmBaseUrl}/models`, {
    headers: { Authorization: `Bearer ${ENV.llmApiKey}` },
  });
  if (!response.ok) throw new Error(`Model listesi alınamadı: ${response.status}`);
  return (await response.json()) as LLMModelList;
}
