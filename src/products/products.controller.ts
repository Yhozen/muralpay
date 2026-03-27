import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsService } from './products.service';
import { User, type UserEntity } from 'src/users/users.decorators';
import { Product } from 'src/generated/prisma/client';

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
