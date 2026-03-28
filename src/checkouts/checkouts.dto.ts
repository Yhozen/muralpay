import { IsInt, IsString, Min } from 'class-validator';

export class AddProductToCheckoutSessionDto {
  @IsString()
  checkoutSessionId: string;
  @IsString()
  productId: string;
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCheckoutSessionItemDto {
  @IsString()
  checkoutSessionId: string;
  @IsString()
  productId: string;
  @IsInt()
  @Min(1)
  quantity: number;
}

export class RemoveProductFromCheckoutSessionDto {
  @IsString()
  checkoutSessionId: string;
  @IsString()
  productId: string;
}
