import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from './entities/auth.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided username',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: User,
  })
  @ApiConflictResponse({
    description: 'Username already exists',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input (username must be at least 3 characters)',
  })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with username',
    description:
      'Authenticates a user with their username only (no password required)',
  })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('users')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all registered users',
  })
  @ApiOkResponse({
    description: 'List of all users',
    type: [User],
  })
  findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
    example: '65c4d72e5d512a81c77a5c22',
  })
  @ApiOkResponse({
    description: 'User details',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }
}
