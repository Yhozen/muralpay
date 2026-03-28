import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../generated/prisma/client';

@Controller('merchants/:merchantId/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  async getProducts(
    @Param('merchantId') merchantId: string,
  ): Promise<Product[]> {
    return this.productService.getProducts(merchantId);
  }
}
