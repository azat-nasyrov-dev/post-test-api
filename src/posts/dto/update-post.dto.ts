import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ example: 'Updated title', description: 'Title' })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Updated description', description: 'Description' })
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
