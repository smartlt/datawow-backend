import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Updated post title',
    minLength: 3,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the updated content of my post',
    minLength: 10,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @ApiProperty({
    description: 'Category ID',
    example: '65c4d72e5d512a81c77a5c22',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;
}
