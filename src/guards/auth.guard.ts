import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

type JWTPayload = {
  name: string;
  id: number;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];

      try {
        const { id } = (await jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        )) as JWTPayload;

        const { user_type } = await this.prismaService.user.findUnique({
          where: { id },
          select: {
            user_type: true,
          },
        });
        if (!user_type) return false;
        // rolesの中にリクエストユーザーのroleが一致しない場合は403
        if (!roles.includes(user_type)) return false;
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    return true;
  }
}
