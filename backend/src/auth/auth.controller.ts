import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(
      registerUserDto.name,
      registerUserDto.email,
      registerUserDto.password,
    );
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const tokens = await this.authService.login({ email: user.email, _id: user._id.toString() });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('node_env') === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return { accessToken: tokens.accessToken, user };
  }

  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const { accessToken, newRefreshToken, user } =
      await this.authService.refreshTokens(refreshToken);

    // Set new refresh token cookie (rotated)
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken, user };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user['sub'];
    const sessionId = req.cookies['session_id'];

    if (!sessionId) {
      throw new UnauthorizedException('No session found');
    }

    await this.authService.removeSession(userId, sessionId);

    // Clear cookies
    res.clearCookie('refresh_token');
    res.clearCookie('session_id');

    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
