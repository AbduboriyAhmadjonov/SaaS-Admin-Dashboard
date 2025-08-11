import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import e, { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('Can activate token: ' + token);
    if (!token) throw new UnauthorizedException();

    const secret = this.configService.get<string>('jwt.jwtConstants');
    console.log('secret' + secret);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      console.log('Payload' + payload);

      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log('Type: ' + type);
    console.log('Token: ' + token);

    return type === 'Bearer' ? token : undefined;
  }
}
