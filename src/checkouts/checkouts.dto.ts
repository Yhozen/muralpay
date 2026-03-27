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
