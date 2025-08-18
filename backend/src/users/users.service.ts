import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) throw new UnauthorizedException('Email already in use');

    return new this.userModel(createUserDto).save(); // password already hashed in AuthService
  }

  async findBySomething(field: string, value: string): Promise<UserDocument> {
    console.log(`Searching for user by ${field} = ${value}`);
    const user = await this.userModel.findOne({ [field]: value }).exec();
    if (!user) throw new Error(`Cannot find a user with ${field}: ${value}`);
    console.log('User found:', user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteAll() {
    return this.userModel.deleteMany({});
  }

  async addRefreshToken(userId: string, token: string, ua?: string, ip?: string): Promise<boolean> {
    const session = {
      sessionId: new Types.ObjectId().toString(),
      refreshTokenHash: token,
      ua: ua || 'unknown',
      ip: ip || 'unknown',
      createdAt: new Date(),
      lastUsedAt: new Date(),
    };

    const result = await this.userModel.updateOne(
      { _id: userId },
      { $push: { sessions: session } },
    );
    return result.modifiedCount > 0;
  }

  async removeTokens(userId, sessionId) {
    return this.userModel.updateOne({ _id: userId }, { $pull: { sessions: { sessionId } } });
  }
}
