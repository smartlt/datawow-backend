import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Category, CategoryDocument } from './entities/category.entity';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  // ================ Post methods ================

  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<Post> {
    // Check if category exists
    const category = await this.categoryModel
      .findById(createPostDto.categoryId)
      .exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Create new post
    const newPost = new this.postModel({
      title: createPostDto.title,
      content: createPostDto.content,
      author: userId,
      category: createPostDto.categoryId,
      comments: [],
    });

    return newPost.save();
  }

  async findAllPosts(): Promise<Post[]> {
    return this.postModel
      .find()
      .populate('author', 'username')
      .populate('category', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username',
        },
      })
      .exec();
  }

  async findOnePost(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'username')
      .populate('category', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username',
        },
      })
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    // Check if post exists
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // Only the author can update the post
    // @ts-expect-error - MongoDB ObjectId needs special comparison
    if (post.author != userId) {
      throw new ConflictException('You are not authorized to update this post');
    }

    // Check if category exists when updating category
    if (updatePostDto.categoryId) {
      const category = await this.categoryModel
        .findById(updatePostDto.categoryId)
        .exec();
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        {
          title: updatePostDto.title,
          content: updatePostDto.content,
          category: updatePostDto.categoryId,
        },
        { new: true },
      )
      .exec();

    if (!updatedPost) {
      throw new NotFoundException('Post not found after update');
    }

    return updatedPost;
  }

  async removePost(id: string, userId: string): Promise<Post> {
    // Check if post exists
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Only the author can delete the post
    // @ts-expect-error - MongoDB ObjectId needs special comparison
    if (post.author != userId) {
      throw new ConflictException('You are not authorized to delete this post');
    }

    // Delete all comments related to this post
    await this.commentModel.deleteMany({ post: id }).exec();

    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();

    if (!deletedPost) {
      throw new NotFoundException('Post not found after delete');
    }

    return deletedPost;
  }

  // ================ Category methods ================

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    // Check if category already exists
    const existingCategory = await this.categoryModel
      .findOne({ name: createCategoryDto.name })
      .exec();
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    // Create new category
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAllCategories(): Promise<Category[]> {
    return Promise.resolve([]);
  }

  async findOneCategory(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  // ================ Comment methods ================

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

  async deleteComment(commentId: string, userId: string): Promise<Comment> {
    // Find the comment
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is the author of the comment
    if (comment.author._id != userId) {
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
