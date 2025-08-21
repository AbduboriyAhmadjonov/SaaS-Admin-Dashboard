import { IsBoolean, IsDate, IsEnum, IsMongoId, IsString } from 'class-validator';

import { TokenType } from '../schemas/tokens.schema';

export class CreateTokensDto {
  @IsMongoId()
  readonly userId: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly token: string;

  @IsBoolean()
  readonly type: boolean;

  @IsDate()
  readonly expiresAt: Date;

  @IsEnum(TokenType)
  readonly typeVerificationToken: TokenType;

  @IsDate()
  readonly verifiedAt: Date;
}
