import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '65c4d72e5d512a81c77a5c22',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;
}
