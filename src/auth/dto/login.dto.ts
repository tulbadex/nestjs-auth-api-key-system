import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  // password type
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  password: string;
}
