import type { BackendRequestOptions, MobileBackendClient } from './requestBackendTypes';

function createErrorResponse<DataType>(message: string): Entity.ApiResponse<DataType> {
  return { success: false, data: null as DataType, error: message };
}

export async function requestBackendThroughMobileClient<DataType>(
  backendUrl: string,
  pathname: string,
  options: BackendRequestOptions,
  mobileClient: MobileBackendClient,
): Promise<Entity.ApiResponse<DataType>> {
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    ...options.headers,
  };

  if (
    (options.credentials ?? 'include') === 'include' &&
    typeof document !== 'undefined' &&
    document.cookie
  ) {
    mergedHeaders.Cookie = document.cookie;
  }

  try {
    const response = await mobileClient.requestJson({
      url: `${backendUrl}${pathname}`,
      method: options.method,
      headers: mergedHeaders,
      ...(options.body !== undefined ? { jsonBody: options.body } : {}),
    });

    const parsedResponse = response.body as Entity.ApiResponse<DataType>;
    if (
      typeof parsedResponse !== 'object' ||
      parsedResponse === null ||
      !('success' in parsedResponse)
    ) {
      return createErrorResponse<DataType>(`Request failed (${response.status}).`);
    }

    if (response.status < 200 || response.status >= 300 || !parsedResponse.success) {
      return createErrorResponse(parsedResponse.error ?? `Request failed (${response.status}).`);
    }

    return parsedResponse;
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Request failed.');
  }
}
