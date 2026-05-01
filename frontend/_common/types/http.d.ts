
export {};

declare global {
  namespace Entity {
    interface ApiResponse<DataType> {
      success: boolean;
      data: DataType;
      error: string | null;
    }
  }
}