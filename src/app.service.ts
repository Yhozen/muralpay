import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationSchema } from './config/configuration';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<ConfigurationSchema, true>) {}
  getHello(): string {
    const port = this.configService.get('PORT', { infer: true });
    return `Hello World! on port ${port}`;
  }
}
