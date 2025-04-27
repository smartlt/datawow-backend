import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { UserDocument } from '../../auth/entities/auth.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({
    description: 'Post title',
    example: 'My first post',
    type: String,
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the content of my first post',
    type: String,
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'Post author',
    type: String,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: UserDocument;

  @ApiProperty({
    description: 'Post category',
    type: String,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @ApiProperty({
    description: 'Post comments',
    type: [String],
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  comments: Comment[];

  @ApiProperty({
    description: 'Post creation date',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description: 'Post last update date',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  @Prop()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
