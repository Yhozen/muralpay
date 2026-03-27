import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import {
  CheckoutSession,
  CheckoutSessionItem,
} from 'src/generated/prisma/browser';
import { User, type UserEntity } from 'src/users/users.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddProductToCheckoutSessionDto } from './checkouts.dto';

@Controller('checkouts')
@UseGuards(AuthGuard)
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}
  @Post('create')
  async createCheckoutSession(
    @User() user: UserEntity,
  ): Promise<CheckoutSession> {
    return this.checkoutsService.createCheckoutSession(user.id);
  }
  @Post('add-product')
  async addProductToCheckoutSession(
    @Body() body: AddProductToCheckoutSessionDto,
    @User() user: UserEntity,
  ): Promise<CheckoutSessionItem> {
    return this.checkoutsService.addProductToCheckoutSession({
      checkoutSessionId: body.checkoutSessionId,
      productId: body.productId,
      quantity: body.quantity,
      userId: user.id,
    });
  }
}
