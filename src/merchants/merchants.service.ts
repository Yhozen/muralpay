import { Injectable } from '@nestjs/common';
import { Merchant } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MerchantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMerchants(): Promise<Merchant[]> {
    return this.prismaService.merchant.findMany();
  }
  async getMerchant(id: string): Promise<Merchant | null> {
    return this.prismaService.merchant.findUnique({
      where: {
        id: id,
      },
    });
  }
}
