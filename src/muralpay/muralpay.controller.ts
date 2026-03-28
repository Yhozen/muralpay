import { Body, Controller, Post } from '@nestjs/common';

@Controller('muralpay')
export class MuralpayController {
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log(JSON.stringify(body, null, 2));
    return {
      message: 'Webhook received',
    };
  }
}
