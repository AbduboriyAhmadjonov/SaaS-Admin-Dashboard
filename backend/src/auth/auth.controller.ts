import { Body, Controller, Post, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register.dto';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(
      registerUserDto.name,
      registerUserDto.email,
      registerUserDto.password,
    );
  }

  @Public()
  @Post('login') // Need to add csrf
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('=== LOGIN REQUEST RECEIVED ===');
    console.log('Request body:', body);
    console.log('Email:', body.email);
    console.log('Password length:', body.password?.length);

    const user = await this.authService.validateUser(body.email, body.password);
    const { accessToken, refreshToken } = await this.authService.login({
      email: user.email,
      _id: user._id.toString(),
    });

    const csrf = randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrf, { httpOnly: false, sameSite: 'lax', maxAge: 15 * 60 * 1000 }); // 15 minutes
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return { accessToken, csrfToken: csrf };
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    console.log(`refreshToken: ${refreshToken}`);
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const { accessToken, newRefreshToken, user } =
      await this.authService.refreshTokens(refreshToken);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken, user };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.sub; // from access-token payload
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) return { message: 'Already logged out' };

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });

      // ensure the token belongs to the logged-in user
      if (payload.sub !== userId) throw new UnauthorizedException('Token mismatch');

      await this.authService.logout(userId, payload.sub); // sessionId = userId works
    } catch {
      // ignore invalid/expired refresh token
    }

    res.clearCookie('refresh_token');
    res.clearCookie('csrf_token');
    return { message: 'Logged out' };
  }

  // @UseGuards(AuthGuard)
  // @Post('logout')
  // async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
  //   const userId = req.user._id;
  //   const refreshToken = req.cookies['refresh_token'];

  //   if (refreshToken) {
  //     const payload = this.jwtService.verify(refreshToken, {
  //       secret: this.config.get<string>('jwt.refreshSecret'),
  //     });
  //     await this.authService.logout(payload.sub, refreshToken);
  //   }
  //   res.clearCookie('refresh_token');
  //   return { message: 'Logged out' };
  // }

  // @UseGuards(AuthGuard)
  // @Get('sessions')
  // async getSessions(@Req() req: Request) {
  //   return this.authService.getUserSessions(req.user._id);
  // }
}
