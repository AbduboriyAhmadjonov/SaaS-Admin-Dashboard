import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { Tokens, TokensSchema } from './schemas/tokens.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
