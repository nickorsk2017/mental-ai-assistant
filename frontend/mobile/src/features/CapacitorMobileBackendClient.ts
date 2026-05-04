import { CapacitorHttp } from '@capacitor/core';
import type { MobileBackendClient } from '@common/shared/utils';

export function createCapacitorMobileBackendClient(): MobileBackendClient {
  return {
    async requestJson({ url, method, headers, jsonBody }) {
      const response = await CapacitorHttp.request({
        url,
        method,
        headers,
        ...(jsonBody !== undefined ? { data: jsonBody } : {}),
      });

      let body: unknown = response.data;

      if (typeof body === 'string') {
        try {
          body = JSON.parse(body) as unknown;
        } catch {
          body = { success: false, data: null, error: 'Invalid response from server.' };
        }
      }

      return { status: response.status, body };
    },
  };
}
