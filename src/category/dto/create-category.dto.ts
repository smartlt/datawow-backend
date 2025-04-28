import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Technology',
    minLength: 3,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Posts about technology and gadgets',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
