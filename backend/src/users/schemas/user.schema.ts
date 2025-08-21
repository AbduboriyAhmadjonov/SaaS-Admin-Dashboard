import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  isVerified: boolean;

  @Prop({
    type: [
      {
        sessionId: String,
        refreshTokenHash: String,
        ua: String,
        ip: String,
        createdAt: Date,
        lastUsedAt: Date,
      },
    ],
    default: [],
  })
  sessions: Array<{
    sessionId: string;
    refreshTokenHash: string;
    createdAt: Date;
    lastUsedAt: Date;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
export { User };
