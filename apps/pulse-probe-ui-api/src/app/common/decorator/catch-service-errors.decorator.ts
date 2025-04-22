import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function CatchServiceErrors() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        Logger.error(
          `[${target.constructor.name}.${propertyKey}]`,
          error.message || error.stack
        );

        // Let already-handled exceptions bubble up
        if (error instanceof HttpException) {
          throw error;
        }

        // Everything else becomes generic 500
        throw new InternalServerErrorException('Internal server error');
      }
    };

    return descriptor;
  };
}
