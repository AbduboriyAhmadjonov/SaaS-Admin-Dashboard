import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsBoolean()
  readonly isVerified: boolean;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
