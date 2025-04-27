import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { UserDocument } from '../../auth/entities/auth.entity';
import { Post } from './post.entity';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty({
    description: 'Comment content',
    example: 'Great post!',
    type: String,
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'Comment author',
    type: String,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: UserDocument;

  @ApiProperty({
    description: 'Post that this comment belongs to',
    type: String,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description: 'Comment last update date',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  @Prop()
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
