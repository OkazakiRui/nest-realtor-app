import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserPayload = {
  name: string;
  id: number;
  iat: number;
  exp: number;
};

export const User = createParamDecorator(
  (_, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
