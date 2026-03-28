import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CheckoutSession,
  CheckoutSessionItem,
  CheckoutSessionStatus,
} from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckoutsService {
  logger = new Logger(CheckoutsService.name);
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

  async getCurrentCheckoutSession(
    userId: string,
  ): Promise<CheckoutSession | null> {
    return await this.prismaService.checkoutSession.findFirst({
      where: {
        userId: userId,
        status: CheckoutSessionStatus.PENDING,
      },
      include: {
        checkoutSessionItems: true,
      },
    });
  }

  async completeCheckoutSession(
    checkoutSessionId: string,
    userId: string,
  ): Promise<number> {
    await this.validateCheckoutSession(checkoutSessionId, userId);
    const checkoutSession = await this.prismaService.checkoutSession.update({
      where: { id: checkoutSessionId },
      data: { status: CheckoutSessionStatus.COMPLETED },
      include: {
        checkoutSessionItems: { include: { product: true } },
      },
    });

    const totalAmount = checkoutSession.checkoutSessionItems.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );

    return totalAmount;
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
    await this.validateCheckoutSession(checkoutSessionId, userId);

    return this.prismaService.checkoutSessionItem.create({
      data: {
        checkoutSessionId: checkoutSessionId,
        productId: productId,
        quantity: quantity,
      },
    });
  }
  async updateCheckoutSessionItem({
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
    await this.validateCheckoutSession(checkoutSessionId, userId);
    const checkoutSessionItems =
      await this.prismaService.checkoutSessionItem.findMany({
        where: {
          checkoutSessionId: checkoutSessionId,
          productId: productId,
        },
      });
    if (!checkoutSessionItems || checkoutSessionItems.length === 0) {
      throw new NotFoundException('Checkout session item not found');
    }
    if (checkoutSessionItems.length > 1) {
      this.logger.warn('Multiple checkout session items found');
      await this.prismaService.checkoutSessionItem.deleteMany({
        where: {
          checkoutSessionId: checkoutSessionId,
          productId: productId,
        },
      });
      return this.prismaService.checkoutSessionItem.create({
        data: {
          checkoutSessionId: checkoutSessionId,
          productId: productId,
          quantity: quantity,
        },
      });
    }
    const checkoutSessionItem = checkoutSessionItems.at(0)!;

    return this.prismaService.checkoutSessionItem.update({
      where: {
        id: checkoutSessionItem.id,
      },
      data: {
        quantity: quantity,
      },
    });
  }

  async removeProductFromCheckoutSession({
    checkoutSessionId,
    productId,
    userId,
  }: {
    checkoutSessionId: string;
    productId: string;
    userId: string;
  }): Promise<void> {
    await this.validateCheckoutSession(checkoutSessionId, userId);
    this.prismaService.checkoutSessionItem.deleteMany({
      where: {
        checkoutSessionId: checkoutSessionId,
        productId: productId,
      },
    });
  }

  private async validateCheckoutSession(
    checkoutSessionId: string,
    userId: string,
  ): Promise<CheckoutSession> {
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
    return checkoutSession;
  }
}
