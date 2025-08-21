import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { Tokens, TokensDocument } from './schemas/tokens.schema';
import { Model } from 'mongoose';
import { CreateTokensDto } from './dto/token.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(Tokens.name) private tokensModel: Model<TokensDocument>,
  ) {}

  async generateVerificationToken() {
    const token = randomBytes(32).toString('hex');
    return token;
  }

  async sendVerificationEmail(email: string, token: string) {
    const resend = new Resend(this.config.get<string>('re_send_api_key'));

    try {
      resend.emails.send({
        from: 'norepy@send.mail.abduboriy.tech', // onboarding@resend.dev
        to: email,
        subject: 'Verify your email',
        html: `<p>Please click the link below to verify your email:</p>
               <a href="http://localhost:3000/verify?token=${token}">Verify Email</a>`,
      });
    } catch (error) {
      console.log('Error sending email:', error);
    }
  }

  async addVerificationTokenToDb(createTokensDto: CreateTokensDto): Promise<boolean> {
    const isCreated = await this.tokensModel.create({
      ...createTokensDto,
    });

    return isCreated ? true : false;
  }
}
