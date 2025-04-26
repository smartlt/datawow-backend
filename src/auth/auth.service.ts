import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createAuthDto: CreateAuthDto) {
    // Check if user already exists
    const existingUser = await this.userModel
      .findOne({ username: createAuthDto.username })
      .exec();
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Create new user
    const newUser = new this.userModel(createAuthDto);
    return newUser.save();
  }

  async login(loginDto: LoginDto) {
    // Find user by username
    const user = await this.userModel
      .findOne({ username: loginDto.username })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return user data (in a real app, you'd typically generate a JWT token here)
    return {
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
