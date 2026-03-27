import { Controller, Get } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { Merchant } from 'src/generated/prisma/client';

@Controller('merchants')
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) { }

    @Get()
    async getMerchants(): Promise<Merchant[]> {
        return this.merchantsService.getMerchants();
    }
}
