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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

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

  @Get('my-posts')
  @ApiOperation({
    summary: 'Get posts by authenticated user',
    description:
      'Retrieves all posts created by the currently authenticated user',
  })
  @ApiOkResponse({
    description: 'List of posts by authenticated user',
    type: [PostEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
  })
  getMyPosts(
    @Req() req: Request & { user?: { username?: string; id?: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.postService.findPostsByAuthor(userId);
  }
}
