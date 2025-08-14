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
  HttpCode,
  HttpStatus,
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

  @Post('login') // Need to add csrf
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const tokens = await this.authService.login({ email: user.email, _id: user._id.toString() });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // this.config.get<string>('node_env') === 'production'
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return { accessToken: tokens.accessToken, user };
  }

  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    console.log(`refreshToken: ${refreshToken}`);
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const { accessToken, newRefreshToken, user } =
      await this.authService.refreshTokens(refreshToken);

    // Set new refresh token cookie (rotated)
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken, user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user._id;
    const refreshToken = req.cookies['refresh_token'];

    console.log('userId in auth.controller logout: ' + userId);
    if (refreshToken) {
      await this.authService.logout(refreshToken, userId); // Experimental
    }
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  // @UseGuards(AuthGuard)
  // @Get('sessions')
  // async getSessions(@Req() req: Request) {
  //   return this.authService.getUserSessions(req.user._id);
  // }
}
