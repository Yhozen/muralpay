import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from 'src/generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}
  async getProducts(merchantId: string): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: {
        merchantId: merchantId,
      },
    });
  }
}
