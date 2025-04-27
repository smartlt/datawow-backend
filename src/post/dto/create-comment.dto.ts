import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great post!',
    minLength: 3,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  content: string;

  @ApiProperty({
    description: 'Post ID',
    example: '65c4d72e5d512a81c77a5c22',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
