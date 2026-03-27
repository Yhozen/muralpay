
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import crypto from "node:crypto";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const apiKey = await this.prismaService.apiKey.findUnique({
                where: {
                    id: token
                },
                include: { user: true }
            })
            if (!apiKey) {
                throw new UnauthorizedException();
            }

            request['user'] = apiKey.user;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private safeEqual(a: string, b: string) {
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
    }
}
