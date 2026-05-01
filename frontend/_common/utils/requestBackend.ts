type BackendRequestOptions = {
  method: string;
  body?: unknown;
  accessToken?: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
};

function resolveBackendUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    'http://localhost:4000'
  );
}

function createErrorResponse<DataType>(message: string): Entity.ApiResponse<DataType> {
  return { success: false, data: null as DataType, error: message };
}

export async function requestBackend<DataType>(
  pathname: string,
  options: BackendRequestOptions,
): Promise<Entity.ApiResponse<DataType>> {
  const backendUrl = resolveBackendUrl();
  if (!backendUrl) return createErrorResponse<DataType>('Missing backend configuration.');

  try {
    const response = await fetch(`${backendUrl}${pathname}`, {
      method: options.method,
      credentials: options.credentials ?? 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
        ...options.headers,
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    const parsedResponse = (await response.json()) as Entity.ApiResponse<DataType>;
    if (!response.ok || !parsedResponse.success) {
      return createErrorResponse(parsedResponse.error ?? `Request failed (${response.status}).`);
    }

    return parsedResponse;
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Request failed.');
  }
}
