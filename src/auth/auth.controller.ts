import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { VerifyTokenDto } from './dtos/verify-token.dto';
import { Auth } from './decorators/auth.decorator';
import { authType } from './enums/auth-type.enum';

@Controller('auth')
export class AuthController {
  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Auth(authType.None)
  @HttpCode(HttpStatus.OK)
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-token')
  public async verifyToken(@Body() verifyToken: VerifyTokenDto) {
    return await this.authService.verifyToken(verifyToken);
  }
}
