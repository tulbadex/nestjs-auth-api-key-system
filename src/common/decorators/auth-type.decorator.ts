import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';
export const AuthType = (...types: string[]) => SetMetadata(AUTH_TYPE_KEY, types);
