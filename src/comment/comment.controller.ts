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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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
import { Comment } from '../post/entities/comment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
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
    return this.commentService.createComment(createCommentDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all comments',
    description: 'Retrieves a list of all comments',
  })
  @ApiOkResponse({
    description: 'List of all comments',
    type: [Comment],
  })
  findAllComments() {
    return this.commentService.findAllComments();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get comment by ID',
    description: 'Retrieves a specific comment by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Comment details',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  findCommentById(@Param('id') id: string) {
    return this.commentService.findCommentById(id);
  }

  @Get('post/:postId')
  @ApiOperation({
    summary: 'Get all comments for a post',
    description: 'Retrieves all comments for a specific post',
  })
  @ApiParam({
    name: 'postId',
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
  findPostComments(@Param('postId') postId: string) {
    return this.commentService.findPostComments(postId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a comment',
    description: 'Updates a comment with the provided data',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Comment successfully updated',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Comment not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to update this comment',
  })
  updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request & { user?: { username?: string; id?: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.commentService.updateComment(id, updateCommentDto, userId);
  }

  @Delete(':id')
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
    return this.commentService.deleteComment(id, userId);
  }
}
