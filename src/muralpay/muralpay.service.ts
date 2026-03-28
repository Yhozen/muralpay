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

  async getAccount(accountId: string): Promise<Account> {
    const response = await this.axiosInstance.get<Account>(
      `/accounts/${accountId}`,
    );
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

  async getPayins(): Promise<void> {
    const response = await this.axiosInstance.post(`/payins/search`);
    return response.data;
  }

  async createPayout(amount: number): Promise<void> {
    const data = {
      sourceAccountId: '3e4d73f4-a233-4553-a399-15f870d4b68b',
      payouts: [
        {
          amount: {
            tokenAmount: amount,
            tokenSymbol: 'USDC',
          },
          payoutDetails: {
            type: 'fiat',
            bankName: 'Banco Davivienda',
            bankAccountOwner: 'Gabriel Pérez',
            fiatAndRailDetails: {
              type: 'cop',
              symbol: 'COP',
              bankAccountNumber: '198234567891',
              bankRoutingNumber: '198234567891',
              accountType: 'CHECKING',
              documentType: 'NATIONAL_ID',
              documentNumber: '1234567',
              phoneNumber: '+19179999999',
            },
          },
          recipientInfo: {
            type: 'individual',
            firstName: 'Gabriel',
            lastName: 'Pérez',
            email: 'gabriel@example.com',
            physicalAddress: {
              address1: 'Av siempre',
              country: 'CO',
              state: 'ANT',
              city: 'Medellin',
              zip: '123141',
            },
          },
        },
      ],
    };
    const response = await this.axiosInstance.post(`/payouts`, data);
    return response.data;
  }
}
