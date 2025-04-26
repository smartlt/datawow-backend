import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;
}
