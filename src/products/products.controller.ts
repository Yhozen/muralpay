import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsService } from './products.service';
import { User, type UserEntity } from 'src/users/users.decorators';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }
    @Get()
    async getProducts(@User() user: UserEntity): Promise<string> {
        console.log({ user })

        return this.productService.getTest()
    }
}
