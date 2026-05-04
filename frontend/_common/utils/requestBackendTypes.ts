export type MobileBackendClient = {
  requestJson(input: {
    url: string;
    method: string;
    headers: Record<string, string>;
    jsonBody?: unknown;
  }): Promise<{ status: number; body: unknown }>;
};

export type BackendRequestOptions = {
  method: string;
  body?: unknown;
  accessToken?: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  mobileClient?: MobileBackendClient;
};
