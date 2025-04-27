import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ================ Post Endpoints ================

  @Post()
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Creates a new post with the provided data',
  })
  @ApiCreatedResponse({
    description: 'Post successfully created',
    type: PostEntity,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request & { user?: { username?: string; id?: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postService.createPost(createPostDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description:
      'Retrieves a list of all posts with authors, categories, and comments',
  })
  @ApiOkResponse({
    description: 'List of all posts',
    type: [PostEntity],
  })
  findAllPosts() {
    return this.postService.findAllPosts();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieves a specific post by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Post details',
    type: PostEntity,
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  findOnePost(@Param('id') id: string) {
    return this.postService.findOnePost(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Updates a post with the provided data',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Post successfully updated',
    type: PostEntity,
  })
  @ApiNotFoundResponse({
    description: 'Post or category not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to update this post',
  })
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request & { user?: { username?: string; id?: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postService.updatePost(id, updatePostDto, userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Deletes a post and all its comments',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Post successfully deleted',
    type: PostEntity,
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to delete this post',
  })
  removePost(
    @Param('id') id: string,
    @Req() req: Request & { user?: { username?: string; id?: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postService.removePost(id, userId);
  }

  // ================ Category Endpoints ================

  @Post('categories')
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new category for posts',
  })
  @ApiCreatedResponse({
    description: 'Category successfully created',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.postService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all categories',
  })
  @ApiOkResponse({
    description: 'List of all categories',
    type: [Category],
  })
  findAllCategories() {
    return this.postService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieves a specific category by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Category details',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  findOneCategory(@Param('id') id: string) {
    return this.postService.findOneCategory(id);
  }

  // ================ Comment Endpoints ================

  @Post('comments')
  @ApiOperation({
    summary: 'Create a new comment',
    description: 'Creates a new comment on a post',
  })
  @ApiCreatedResponse({
    description: 'Comment successfully created',
    type: Comment,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request & { user?: { username?: string; id?: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postService.createComment(createCommentDto, userId);
  }

  @Get(':id/comments')
  @ApiOperation({
    summary: 'Get all comments for a post',
    description: 'Retrieves all comments for a specific post',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'List of comments',
    type: [Comment],
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  findPostComments(@Param('id') id: string) {
    return this.postService.findPostComments(id);
  }

  @Delete('comments/:id')
  @ApiOperation({
    summary: 'Delete a comment',
    description: 'Deletes a specific comment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Comment successfully deleted',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to delete this comment',
  })
  deleteComment(
    @Param('id') id: string,
    @Req() req: Request & { user?: { username?: string; id?: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postService.deleteComment(id, userId);
  }
}
