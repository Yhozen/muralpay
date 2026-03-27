import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CheckoutSession,
  CheckoutSessionItem,
  CheckoutSessionStatus,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckoutsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCheckoutSession(userId: string): Promise<CheckoutSession> {
    return this.prismaService.$transaction(async (tx) => {
      // close any existing checkout session for the merchant
      await tx.checkoutSession.updateMany({
        where: {
          status: CheckoutSessionStatus.PENDING,
        },
        data: {
          status: CheckoutSessionStatus.ABANDONED,
        },
      });
      const checkoutSession = await tx.checkoutSession.create({
        data: {
          status: CheckoutSessionStatus.PENDING,
          userId: userId,
        },
      });
      return checkoutSession;
    });
  }

  async addProductToCheckoutSession({
    checkoutSessionId,
    productId,
    quantity,
    userId,
  }: {
    checkoutSessionId: string;
    productId: string;
    quantity: number;
    userId: string;
  }): Promise<CheckoutSessionItem> {
    const checkoutSession = await this.prismaService.checkoutSession.findUnique(
      {
        where: {
          id: checkoutSessionId,
          userId: userId,
        },
      },
    );
    if (!checkoutSession) {
      throw new NotFoundException('Checkout session not found');
    }
    if (checkoutSession.status !== CheckoutSessionStatus.PENDING) {
      throw new BadRequestException('Checkout session is not pending');
    }

    return this.prismaService.checkoutSessionItem.create({
      data: {
        checkoutSessionId: checkoutSessionId,
        productId: productId,
        quantity: quantity,
      },
    });
  }
}
