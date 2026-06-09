import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar o servidor.',
      );
    }
    super({
      // Tenta cookie HttpOnly primeiro; cai para Bearer header (Swagger / API clients)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req?.cookies as Record<string, string>)?.['pst_token'] ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    if (!payload?.sub) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}
