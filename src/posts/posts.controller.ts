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

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

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

  @Get()
  public async findAllPosts(@User('id') currentUserId: string, @Query() query: any): Promise<PostsResponseInterface> {
    try {
      return await this.postsService.findListOfPosts(currentUserId, query);
    } catch (err) {
      this.logger.error(`Error during fetching all posts: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  @Delete(':id')
  public async deletePost(@User('id') currentUserId: string, @Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.postsService.deletePostById(currentUserId, id);
    } catch (err) {
      this.logger.error(`Error during deleting post: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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
