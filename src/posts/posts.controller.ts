import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../users/guards/auth.guard';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseInterface } from './types/post-response.interface';
import { DeleteResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsResponseInterface } from './types/posts-response.interface';
import { INTERNAL_SERVER_ERROR } from './posts.constants';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async create(
    @User() currentUser: UserEntity,
    @Body('post') createPostDto: CreatePostDto,
  ): Promise<PostResponseInterface> {
    try {
      const post = await this.postsService.createPost(currentUser, createPostDto);
      return this.postsService.buildPostResponse(post);
    } catch (err) {
      this.logger.error(`Error during post creation: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts' })
  @Get()
  public async findAllPosts(@User('id') currentUserId: string, @Query() query: any): Promise<PostsResponseInterface> {
    try {
      return await this.postsService.findListOfPosts(currentUserId, query);
    } catch (err) {
      this.logger.error(`Error during fetching all posts: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get single post' })
  @ApiResponse({ status: 200, description: 'Return one post' })
  @Get(':id')
  public async findOnePost(@Param('id') id: string): Promise<PostResponseInterface> {
    try {
      const post = await this.postsService.findPostById(id);
      return this.postsService.buildPostResponse(post);
    } catch (err) {
      this.logger.error(`Error during finding post by ID: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete(':id')
  public async deletePost(@User('id') currentUserId: string, @Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.postsService.deletePostById(currentUserId, id);
    } catch (err) {
      this.logger.error(`Error during deleting post: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async updatePost(
    @User('id') currentUserId: string,
    @Param('id') id: string,
    @Body('post') updatePostDto: UpdatePostDto,
  ): Promise<PostResponseInterface> {
    try {
      const post = await this.postsService.updatePostById(currentUserId, id, updatePostDto);
      return this.postsService.buildPostResponse(post);
    } catch (err) {
      this.logger.error(`Error during updating post: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
