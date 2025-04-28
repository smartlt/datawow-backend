import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../post/entities/comment.entity';
import { Post, PostDocument } from '../post/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    // Check if post exists
    const post = await this.postModel.findById(createCommentDto.postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Create new comment
    const newComment = new this.commentModel({
      content: createCommentDto.content,
      author: userId,
      post: createCommentDto.postId,
    });

    const savedComment = await newComment.save();

    // Add comment to post
    await this.postModel
      .findByIdAndUpdate(createCommentDto.postId, {
        $push: { comments: savedComment._id },
      })
      .exec();

    return savedComment;
  }

  async findAllComments(): Promise<Comment[]> {
    return this.commentModel.find().populate('author', 'username').exec();
  }

  async findCommentById(id: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(id)
      .populate('author', 'username')
      .populate('post', 'title')
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async findPostComments(postId: string): Promise<Comment[]> {
    // Check if post exists
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.commentModel
      .find({ post: postId })
      .populate('author', 'username')
      .exec();
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    // Find the comment
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is the author of the comment
    // @ts-expect-error - MongoDB ObjectId needs special comparison
    if (comment.author != userId) {
      throw new ConflictException(
        'You are not authorized to update this comment',
      );
    }

    // Update the comment
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();

    if (!updatedComment) {
      throw new NotFoundException('Comment not found after update');
    }

    return updatedComment;
  }

  async deleteComment(commentId: string, userId: string): Promise<Comment> {
    // Find the comment
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is the author of the comment
    // @ts-expect-error - MongoDB ObjectId needs special comparison
    if (comment.author != userId) {
      throw new ConflictException(
        'You are not authorized to delete this comment',
      );
    }

    // Remove comment from the post's comments array
    await this.postModel
      .updateOne({ _id: comment.post }, { $pull: { comments: commentId } })
      .exec();

    // Delete the comment
    const deletedComment = await this.commentModel
      .findByIdAndDelete(commentId)
      .exec();

    if (!deletedComment) {
      throw new NotFoundException('Comment not found after deletion attempt');
    }

    return deletedComment;
  }
}
