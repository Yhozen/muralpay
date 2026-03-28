import { Module } from '@nestjs/common';
import { MuralpayService } from './muralpay.service';

@Module({
  providers: [MuralpayService],
  exports: [MuralpayService],
})
export class MuralpayModule {}
