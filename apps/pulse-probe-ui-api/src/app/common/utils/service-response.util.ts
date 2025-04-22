import { HttpException } from '@nestjs/common';
import { ServiceResponse } from '../interface';

export function buildServiceResponse<T>(
  input: T | HttpException,
  message?: string,
  statusCode?: number
): ServiceResponse<T> {
  if (input instanceof HttpException) {
    const response: any = input.getResponse();
    return {
      statusCode: input.getStatus(),
      success: false,
      message: response?.message || input.message || 'An error occurred',
      data: null,
    };
  }

  return {
    statusCode: statusCode || 200,
    success: true,
    message: message || 'Operation successful',
    data: input,
  };
}
