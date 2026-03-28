import { Module } from '@nestjs/common';
import { MuralpayService } from './muralpay.service';
import { MuralpayController } from './muralpay.controller';

@Module({
  providers: [MuralpayService],
  exports: [MuralpayService],
  controllers: [MuralpayController],
})
export class MuralpayModule {}
