import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationSchema } from 'src/config/configuration';
import MuralPay from '@api/mural-production';

@Injectable()
export class MuralpayService {
    sdk: typeof MuralPay;
    constructor(private readonly configService: ConfigService<ConfigurationSchema, true>) {
        this.sdk = MuralPay
        const apiKey = this.configService.get('MURALPAY_API_KEY', {infer: true});

        this.sdk.auth(apiKey);
        this.sdk.server('https://api-staging.muralpay.com');
    }
}
