import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Updated Technology',
    minLength: 3,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Updated description for technology posts',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
