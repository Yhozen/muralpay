import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, CreateUserResponse } from './users.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }

    async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
        const result = await this.prismaService.user.create({
            data: { ...createUserDto, apiKeys: { create: [{ name: "Default API Key" }] } },
            include: { apiKeys: true }

        });
        const apiKey = result.apiKeys.at(0)
        if (!apiKey) {
            throw new Error("Failed to create defautl api key")
        }
        return {
            id: result.id,
            email: result.email,
            apiKey: apiKey.id
        }
    }
}
