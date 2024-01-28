import {
  Body,
  Controller,
  Delete,
  Get,
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
    const post = await this.postsService.createPost(currentUser, createPostDto);
    return this.postsService.buildPostResponse(post);
  }

  @Get()
  public async findAllPosts(@User('id') currentUserId: string, @Query() query: any): Promise<PostsResponseInterface> {
    return await this.postsService.findListOfPosts(currentUserId, query);
  }

  @Get(':id')
  public async findOnePost(@Param('id') id: string): Promise<PostResponseInterface> {
    const post = await this.postsService.findPostById(id);
    return this.postsService.buildPostResponse(post);
  }

  @Delete(':id')
  public async deletePost(@User('id') currentUserId: string, @Param('id') id: string): Promise<DeleteResult> {
    return await this.postsService.deletePostById(currentUserId, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async updatePost(
    @User('id') currentUserId: string,
    @Param('id') id: string,
    @Body('post') updatePostDto: UpdatePostDto,
  ): Promise<PostResponseInterface> {
    const post = await this.postsService.updatePostById(currentUserId, id, updatePostDto);
    return this.postsService.buildPostResponse(post);
  }
}
