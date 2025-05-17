import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { authType } from 'src/auth/enums/auth-type.enum';

// authType

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = authType.Bearer;
  private readonly authTypeGuardmap: Record<
    authType,
    CanActivate | CanActivate[]
  > = {
    [authType.Bearer]: this.accessTokenGuard,
    [authType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(this.authTypeGuardmap);
    return true;
  }
}
