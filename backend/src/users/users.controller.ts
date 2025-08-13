import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/createUser')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('/findByEmail')
  async findByEmail(@Body() email: string): Promise<User> {
    return this.findByEmail(email);
  }

  @Get('/findAll')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('deleteAll')
  async deleteAll() {
    return await this.usersService.deleteAll();
  }
}
