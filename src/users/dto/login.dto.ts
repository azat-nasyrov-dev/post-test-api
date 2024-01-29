import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@gmail.com', description: 'Email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  readonly password: string;
}
