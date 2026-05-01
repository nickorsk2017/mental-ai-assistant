export type ServiceResponse<DataType> = Entity.ApiResponse<DataType>;

export function buildSuccessResponse<DataType>(data: DataType): ServiceResponse<DataType> {
  return { success: true, data, error: null };
}

export function buildErrorResponse<DataType = null>(message: string): ServiceResponse<DataType> {
  return { success: false, data: null as DataType, error: message };
}
