import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import {
  CheckoutSession,
  CheckoutSessionItem,
} from 'src/generated/prisma/browser';
import { User, type UserEntity } from 'src/users/users.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  AddProductToCheckoutSessionDto,
  RemoveProductFromCheckoutSessionDto,
  UpdateCheckoutSessionItemDto,
} from './checkouts.dto';

@Controller('checkouts')
@UseGuards(AuthGuard)
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}
  @Get('current')
  async getCurrentCheckoutSession(
    @User() user: UserEntity,
  ): Promise<CheckoutSession> {
    const checkoutSession =
      await this.checkoutsService.getCurrentCheckoutSession(user.id);
    if (!checkoutSession) {
      throw new NotFoundException('Checkout session not found');
    }
    return checkoutSession;
  }

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

  @Post('update-item')
  async updateProductInCheckoutSession(
    @Body() body: UpdateCheckoutSessionItemDto,
    @User() user: UserEntity,
  ): Promise<CheckoutSessionItem> {
    return this.checkoutsService.updateCheckoutSessionItem({
      checkoutSessionId: body.checkoutSessionId,
      productId: body.productId,
      quantity: body.quantity,
      userId: user.id,
    });
  }

  @Post('remove-product')
  async removeProductFromCheckoutSession(
    @Body() body: RemoveProductFromCheckoutSessionDto,
    @User() user: UserEntity,
  ): Promise<void> {
    return this.checkoutsService.removeProductFromCheckoutSession({
      checkoutSessionId: body.checkoutSessionId,
      productId: body.productId,
      userId: user.id,
    });
  }
}
