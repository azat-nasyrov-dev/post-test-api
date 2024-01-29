import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'New post', description: 'Title' })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Some description', description: 'Description' })
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
