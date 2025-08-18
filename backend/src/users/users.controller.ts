import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/createUser')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('/findByEmail')
  async findByEmail(@Body() email: string): Promise<User> {
    return this.findByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Get('/findAll')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
