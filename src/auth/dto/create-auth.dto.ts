import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Username for registration',
    example: 'john_doe',
    minLength: 3,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;
}
