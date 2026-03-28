import { Module } from '@nestjs/common';
import { MuralpayService } from './muralpay.service';

@Module({
  providers: [MuralpayService]
})
export class MuralpayModule {}
