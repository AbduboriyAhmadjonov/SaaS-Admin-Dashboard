import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type TokensDocument = HydratedDocument<Tokens>;

export enum TokenType {
  VERIFY = 'verify',
  RESET = 'reset',
}

@Schema({ timestamps: true })
class Tokens {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  userId: ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  typeVerificationToken: TokenType;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  verifiedAt: Date;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
export { Tokens };
