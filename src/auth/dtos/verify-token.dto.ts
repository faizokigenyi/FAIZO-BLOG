// src/auth/dtos/verify-token.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
