
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import crypto from "node:crypto";
import { ConfigurationSchema } from 'src/config/configuration';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService<ConfigurationSchema, true>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const HARDCODED_API_KEY = this.configService.get("HARDCODED_API_KEY", { infer: true })
            const valid = this.safeEqual(HARDCODED_API_KEY, token)
            if (!valid) {
                throw new UnauthorizedException();
            }

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
