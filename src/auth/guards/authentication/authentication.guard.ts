import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { authType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

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
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log(this.authTypeGuardmap);

    // get the authTypes from the reflector
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      // Boiler plate code from nestjs
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    console.log(authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardmap[type]).flat();

    // default error
    const error = new UnauthorizedException();

    // loop through guards

    for (const instance of guards) {
      // print each instance
      console.log(instance);
      // Decalre a new constant
      const canActivate = await Promise.resolve(
        // Here the AccessToken Guard Will be fired and check if user has permissions to acces
        // Later Multiple AuthTypes can be used even if one of them returns true
        // The user is Authorised to access the resource
        instance.canActivate(context),
      ).catch((err) => {
        error: err;
      });

      // Display Can Activate
      console.log(canActivate);
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
