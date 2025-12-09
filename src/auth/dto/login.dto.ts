import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  // User email for authentication
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  // User password for authentication
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  password: string;
}
