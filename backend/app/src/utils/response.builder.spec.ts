import { buildErrorResponse, buildSuccessResponse } from './response.builder';

describe('response.builder', () => {
  it('buildSuccessResponse returns success envelope', () => {
    const payload = { id: 'user-1' };

    expect(buildSuccessResponse(payload)).toEqual({
      success: true,
      data: payload,
      error: null,
    });
  });

  it('buildErrorResponse returns error envelope', () => {
    expect(buildErrorResponse('Something failed')).toEqual({
      success: false,
      data: null,
      error: 'Something failed',
    });
  });
});
