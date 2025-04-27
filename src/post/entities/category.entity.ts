import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({
    description: 'Category name',
    example: 'Technology',
    type: String,
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Posts about technology and gadgets',
    type: String,
  })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'Category creation date',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description: 'Category last update date',
    example: '2023-09-15T12:34:56.789Z',
    type: Date,
  })
  @Prop()
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
