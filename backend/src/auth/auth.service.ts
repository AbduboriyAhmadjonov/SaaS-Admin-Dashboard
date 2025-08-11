import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    console.log('Passed validation');
    return user;
  }

  async login(user: UserDocument) {
    const payload = { sub: user._id, email: user.email };

    const accessExpiration = this.configService.get<string>('jwt.accessExpiration');
    const refreshExpiration = this.configService.get<string>('jwt.refreshExpiration');
    const bcryptSalt = this.configService.get<number>('bcrypt.saltRounds') ?? 10;
    const secret = this.configService.get<string>('jwt.jwtConstants');

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessExpiration,
      secret: secret,
    });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshExpiration });

    user.refreshToken = await bcrypt.hash(refreshToken, bcryptSalt);

    await user.save();
    return { accessToken, refreshToken };
  }
}
