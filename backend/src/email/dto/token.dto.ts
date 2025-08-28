import { IsBoolean, IsDate, IsEnum, IsMongoId, IsString } from 'class-validator';

import { TokenType } from '../schemas/tokens.schema';

export class CreateTokensDto {
  @IsMongoId()
  readonly userId: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly token: string;

  @IsEnum(TokenType)
  readonly typeVerificationToken: TokenType;

  @IsDate()
  readonly expiresAt: Date;

  @IsDate()
  readonly verifiedAt: Date;
}
