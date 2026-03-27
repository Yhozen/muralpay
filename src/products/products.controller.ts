import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsService } from './products.service';
import { User, type UserEntity } from 'src/users/users.decorators';


type Product = {
    id: string
    name: string
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date
}

const PRODUCTS = [
    {
        id: '1',
        name: 'Product 1',
        price: 100,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '2',
        name: 'Product 2',
        price: 200,
        stock: 200,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '3',
        name: 'Product 3',
        price: 300,
        stock: 300,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]



@Controller('merchants/:merchantId/products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }
    @Get()
    async getProducts(): Promise<Product[]> {
        return PRODUCTS
    }
}
