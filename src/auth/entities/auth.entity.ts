import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({
    description: 'Username (unique identifier)',
    example: 'john_doe',
    type: String,
  })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
