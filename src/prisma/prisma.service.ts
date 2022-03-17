import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * 使用する際にDBと接続します
   * @date 2022-03-17
   * @returns {void}
   */
  async onModuleInit() {
    await this.$connect;
  }
  /**
   * 使用が終了した際にDBとの接続を切断します
   * @date 2022-03-17
   * @returns {void}
   */
  async onModuleDestroy() {
    await this.$disconnect;
  }
}
