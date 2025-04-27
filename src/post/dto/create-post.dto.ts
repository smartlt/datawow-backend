import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'My first post',
    minLength: 3,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the content of my first post',
    minLength: 10,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({
    description: 'Category ID',
    example: '65c4d72e5d512a81c77a5c22',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;
}
