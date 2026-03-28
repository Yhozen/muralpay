import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { Merchant } from '../generated/prisma/client';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  async getMerchants(): Promise<Merchant[]> {
    return this.merchantsService.getMerchants();
  }

  @Get(':id')
  async getMerchant(@Param('id') id: string): Promise<Merchant> {
    const merchant = await this.merchantsService.getMerchant(id);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }
}
