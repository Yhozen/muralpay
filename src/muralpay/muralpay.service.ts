import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationSchema } from 'src/config/configuration';
import axios, { AxiosInstance } from 'axios';

type Account = {
  id: string;
  name: string;
  description: string;
};
@Injectable()
export class MuralpayService {
  private readonly axiosInstance: AxiosInstance;
  constructor(
    private readonly configService: ConfigService<ConfigurationSchema, true>,
  ) {
    const apiKey = this.configService.get('MURALPAY_API_KEY', { infer: true });
    const server = 'https://api-staging.muralpay.com/api';

    this.axiosInstance = axios.create({
      baseURL: server,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async getAccounts(): Promise<Account[]> {
    const response = await this.axiosInstance.get<Account[]>('/accounts');
    return response.data;
  }
  async createAccount(
    blockchain: 'POLYGON' | 'ETHEREUM' = 'POLYGON',
  ): Promise<Account> {
    const response = await this.axiosInstance.post<Account>(
      '/accounts',
      {
        destinationToken: { blockchain, symbol: 'USDC' },
        name: 'Merchant Default Account',
      },
      {
        headers: {
          'transfer-api-key': this.configService.get('MURAL_TRANSFER_API_KEY', {
            infer: true,
          }),
        },
      },
    );
    return response.data;
  }
}
