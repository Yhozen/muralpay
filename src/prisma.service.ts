
import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigurationSchema } from './config/configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService<ConfigurationSchema, true>) {
    const databaseUrl = configService.get('DATABASE_URL', { infer: true });
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    super({ adapter });
  }
}
