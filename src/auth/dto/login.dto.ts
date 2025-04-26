import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username to login with',
    example: 'john_doe',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}
