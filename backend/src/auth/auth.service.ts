import { forwardRef, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Registration */
  async register(name: string, email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('hashedPassword" ' + hashedPassword);

      return this.usersService.create({ name, email, password: hashedPassword });
    } catch (error) {
      console.log(error);
    }
  }

  /** Validation users */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findBySomething('email', email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return { email: user.email, _id: user._id }; // Return email and _id
  }

  /** Login */
  async login(user: { email: string; _id: string }) {
    const payload = { email: user.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessExpiration'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiration'),
    });

    const userWithoutToken = await this.usersService.findBySomething('email', user.email);
    if (userWithoutToken.sessions.length === 0) {
      userWithoutToken.sessions.push({
        sessionId: `${Date.now()}-${refreshToken}`,
        createdAt: new Date(),
        refreshTokenHash: refreshToken,
        lastUsedAt: new Date(),
      });
    }

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });

      // Find user in DB (optional but recommended to ensure they still exist)
      const user = await this.usersService.findBySomething('email', payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const accessToken = this.jwtService.sign(
        { email: user.email, sub: user._id },
        {
          secret: this.config.get<string>('jwt.accessSecret'),
          expiresIn: this.config.get<string>('jwt.accessExpiration'),
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { email: user.email, sub: user._id },
        {
          secret: this.config.get<string>('jwt.refreshSecret'),
          expiresIn: this.config.get<string>('jwt.refreshExpiration'),
        },
      );

      return { accessToken, newRefreshToken, user };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async removeSession(_id: string, sessionId: string) {
    return this.usersService.removeTokens(_id, sessionId);
  }
}
