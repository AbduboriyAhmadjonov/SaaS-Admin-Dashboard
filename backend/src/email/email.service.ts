import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { Tokens, TokensDocument, TokenType } from './schemas/tokens.schema';
import { Model } from 'mongoose';
import { CreateTokensDto } from './dto/token.dto';
import * as bcrypt from 'bcrypt';

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
    console.log('Token: ' + resend);

    try {
      const result = await resend.emails.send({
        from: 'norepy@mail.abduboriy.tech',
        to: email,
        subject: 'Verify your email',
        html: `<p>Please click the link below to verify your email:</p>
               <a href="http://localhost:5173/verify?token=${token}&email=${email}">Verify Email</a>`,
      });
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.log('Error sending email:', error);
    }
  }

  async addVerificationTokenToDb(createTokensDto: CreateTokensDto): Promise<boolean> {
    const isCreated = await this.tokensModel.create({
      ...createTokensDto,
    });
    console.log('isCreated: ' + isCreated);

    return isCreated ? true : false;
  }

  async findUserByToken(token: string) {
    const tokens = await this.tokensModel.find({ typeVerificationToken: TokenType.VERIFY });

    for (const t of tokens) {
      const isMatch = await bcrypt.compare(token, t.token);
      if (isMatch) return t;
    }

    return null;
  }

  // Must delete before production
  async deleteAllTokens() {
    return this.tokensModel.deleteMany({});
  }
}
