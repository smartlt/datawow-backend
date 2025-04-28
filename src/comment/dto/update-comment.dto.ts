import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'This is my updated comment!',
    minLength: 3,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  content?: string;
}
