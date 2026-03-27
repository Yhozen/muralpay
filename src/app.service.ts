import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationSchema } from './config/configuration';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHello(): Promise<string> {
    const ping = await this.prismaService.$queryRaw`SELECT 1`;

    return `Hello World! ping: ${ping}`;
  }
}
