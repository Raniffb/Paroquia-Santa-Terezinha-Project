import { Controller, Get, Post, Body, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

// 7 dias em milissegundos — deve ser igual ao JWT_EXPIRES_IN
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do administrador' })
  @ApiOkResponse({ description: 'Seta cookie HttpOnly e retorna dados do usuário' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    const result = await this.authService.login(dto);

    // Em produção (Vercel + Render são cross-site) o cookie precisa de
    // sameSite:'none' + Secure para o browser aceitá-lo em AJAX cross-origin.
    // Em dev (localhost) 'lax' é suficiente e não exige HTTPS.
    res.cookie('pst_token', result.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    // access_token mantido na resposta para clients de API / Swagger em dev
    return { user: result.user, access_token: result.access_token };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout — limpa o cookie de sessão' })
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    // clearCookie deve usar as mesmas opções do Set-Cookie original,
    // caso contrário o browser não reconhece o cookie a ser removido.
    res.clearCookie('pst_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
    return { message: 'Logout realizado.' };
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Perfil do admin autenticado (valida token)' })
  @ApiOkResponse({ description: 'Dados do usuário extraídos do JWT' })
  getProfile(@Req() req: Request & { user: { id: number; email: string } }) {
    return req.user;
  }
}
