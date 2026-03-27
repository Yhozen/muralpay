import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }
    @Get()
    async getProducts(): Promise<string> {
        return this.productService.getTest()
    }
}
