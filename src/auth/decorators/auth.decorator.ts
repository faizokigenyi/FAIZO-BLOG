import { SetMetadata } from '@nestjs/common';
import { authType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';

export const Auth = (...authType: authType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authType);