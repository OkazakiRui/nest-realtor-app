import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

type SignupParams = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

type SigninParams = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  private generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }

  async signup({ email, password, name, phone }: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) throw new ConflictException();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    const token = await this.generateJWT(name, user.id);

    return token;
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user)
      throw new HttpException(
        'メールアドレスまたはパスワードが一致しません。',
        400,
      );

    const hashedPassword = user.password;
    // 一致する場合はtrueを返却
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword)
      throw new HttpException(
        'メールアドレスまたはパスワードが一致しません。',
        400,
      );

    const token = await this.generateJWT(user.name, user.id);
    return token;
  }
}
