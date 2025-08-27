import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AuthGuard)
  // @Post('/users')
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.usersService.create(createUserDto);
  // }

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

  // Must delete before production
  @Public()
  @Get('deleteAll')
  async deleteAll() {
    return await this.usersService.deleteAll();
  }
}
