import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MuralpayService } from './muralpay.service';

@Controller('muralpay')
export class MuralpayController {
  logger = new Logger(MuralpayController.name);
  constructor(private readonly prismaService: PrismaService, private readonly muralpayService: MuralpayService) {}
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log(JSON.stringify(body, null, 2));
    const payload = body.payload;
    const type = payload.type as 'account_credited' | 'account_debited';

    switch (type) {
      case 'account_credited':
        await this.handleAccountCredited(payload);
        break;
      case 'account_debited':
        await this.handleAccountDebited(payload);
        break;
    }
    return {
      message: 'Webhook received',
    };
  }

  private async handleAccountCredited(payload: any) {
    // We are going to match by amount only
    const payment = await this.prismaService.payment.findFirst({
      where: {
        amount: payload.amount,
      },
    });
    if (!payment) {
      this.logger.error(`Payment not found for amount: ${payload.amount}`);
      return;
    }
    await this.prismaService.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' },
    });

    // Move money to COP
    await this.muralpayService.createPayout(payload.amount);

  }

  private async handleAccountDebited(payload: any) {
    this.logger.log(JSON.stringify(payload, null, 2));
  }
}
