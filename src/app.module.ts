import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { loadConfiguration } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MerchantsModule } from './merchants/merchants.module';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { MuralpayModule } from './muralpay/muralpay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadConfiguration],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    MerchantsModule,
    CheckoutsModule,
    MuralpayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
