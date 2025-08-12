import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const bcryptSalt = this.configService.get<number>('bcrypt.saltRounds') ?? 10;
    const { email, password, name } = createUserDto;
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);
    const createdUser = new this.userModel({ email, hashedPassword, name });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteAll() {
    return await this.userModel.deleteMany({});
  }
}
