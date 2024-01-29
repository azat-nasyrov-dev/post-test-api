import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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

  @ApiProperty({ example: 'John', description: 'Username' })
  @IsOptional()
  @IsString()
  readonly username?: string;
}
