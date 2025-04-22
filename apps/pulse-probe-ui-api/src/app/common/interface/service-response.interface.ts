export interface ServiceResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T | null;
  success: boolean;
}
