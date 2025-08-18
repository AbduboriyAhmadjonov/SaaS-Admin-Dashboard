import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private async hashToken(token: string) {
    return bcrypt.hash(token, 10);
  }

  /** Registration */
  async register(name: string, email: string, password: string) {
    const hashedPw = await bcrypt.hash(password, 10);
    return this.usersService.create({ name, email, password: hashedPw });
  }

  /** Validation users */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findBySomething('email', email);
    console.log(`User found: ${user ? user.email : 'No user found'}`);
    const hashToCompare = user?.password ?? this.config.get('bcrypt.hash');
    const isMatch = await bcrypt.compare(password, hashToCompare);
    console.log(`Password is: ${isMatch ? '' : 'not'} match`);
    if (!user || !isMatch) throw new UnauthorizedException('Invalid credentials');
    return { email: user.email, _id: user._id };
  }

  /** Login */
  async login(user: { email: string; _id: string }) {
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: '7d',
    });

    const hashedRefresh = await this.hashToken(refreshToken);
    const isModified = await this.usersService.addRefreshToken(user._id, hashedRefresh);
    if (!isModified) throw new Error('Failed to add refresh token');
    return { accessToken, refreshToken };
  }

  async refreshTokens(rawRefresh: string) {
    let payload;
    try {
      payload = this.jwtService.verify(rawRefresh, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findBySomething('email', payload.email);
    if (!user) throw new UnauthorizedException('User not found');

    // 1. verify token exists in sessions
    const session = user.sessions.find((s) => bcrypt.compareSync(rawRefresh, s.refreshTokenHash));
    if (!session) throw new UnauthorizedException('Token not found');

    // 2. rotate: remove old, add new
    await this.usersService.removeTokens(user._id.toString(), session.sessionId);

    const newAccess = this.jwtService.sign(
      { email: user.email, sub: user._id },
      { secret: this.config.get<string>('jwt.accessSecret'), expiresIn: '15m' },
    );
    const newRefresh = this.jwtService.sign(
      { email: user.email, sub: user._id },
      { secret: this.config.get<string>('jwt.refreshSecret'), expiresIn: '7d' },
    );
    const newHashed = await this.hashToken(newRefresh);
    await this.usersService.addRefreshToken(user._id.toString(), newHashed);

    return { accessToken: newAccess, newRefreshToken: newRefresh, user };
  }

  async logout(_id: string, sessionId: string) {
    return this.usersService.removeTokens(_id, sessionId);
  }
}
