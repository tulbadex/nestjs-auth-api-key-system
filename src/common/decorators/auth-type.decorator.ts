import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';
// auth type
export const AuthType = (...types: string[]) => SetMetadata(AUTH_TYPE_KEY, types);