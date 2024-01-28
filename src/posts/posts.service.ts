import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseInterface } from './types/post-response.interface';
import { INTERNAL_SERVER_ERROR, POST_DOES_NOT_EXIST_ERROR, YOU_NOT_AUTHOR_ERROR } from './posts.constants';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsResponseInterface } from './types/posts-response.interface';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  public async createPost(currentUser: UserEntity, createPostDto: CreatePostDto): Promise<PostEntity> {
    try {
      const post = new PostEntity();
      Object.assign(post, createPostDto);
      post.author = currentUser;

      return await this.postRepository.save(post);
    } catch (err) {
      this.logger.error(`Error during post creation: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findListOfPosts(currentUserId: string, query: any): Promise<PostsResponseInterface> {
    try {
      const queryBuilder = this.dataSource
        .getRepository(PostEntity)
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.author', 'author');

      queryBuilder.orderBy('posts.createdAt', 'DESC');

      const postsCount = await queryBuilder.getCount();

      if (query.author) {
        const author = await this.userRepository.findOne({ where: { username: query.author } });
        queryBuilder.andWhere('posts.authorId = :id', {
          id: author.id,
        });
      }

      if (query.limit) {
        queryBuilder.limit(query.limit);
      }

      if (query.offset) {
        queryBuilder.offset(query.offset);
      }

      const posts = await queryBuilder.getMany();

      return { posts, postsCount };
    } catch (err) {
      this.logger.error(`Error during fetching list of posts: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findPostById(id: string): Promise<PostEntity> {
    try {
      return await this.postRepository.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(`Error during finding post by ID: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deletePostById(currentUserId: string, id: string): Promise<DeleteResult> {
    try {
      const post = await this.findPostById(id);

      if (!post) {
        throw new HttpException(POST_DOES_NOT_EXIST_ERROR, HttpStatus.NOT_FOUND);
      }

      if (post.author.id !== currentUserId) {
        throw new HttpException(YOU_NOT_AUTHOR_ERROR, HttpStatus.FORBIDDEN);
      }

      return await this.postRepository.delete({ id });
    } catch (err) {
      this.logger.error(`Error during deleting post: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePostById(currentUserId: string, id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    try {
      const post = await this.findPostById(id);

      if (!post) {
        throw new HttpException(POST_DOES_NOT_EXIST_ERROR, HttpStatus.NOT_FOUND);
      }

      if (post.author.id !== currentUserId) {
        throw new HttpException(YOU_NOT_AUTHOR_ERROR, HttpStatus.FORBIDDEN);
      }

      Object.assign(post, updatePostDto);
      return await this.postRepository.save(post);
    } catch (err) {
      this.logger.error(`Error during updating post: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public buildPostResponse(post: PostEntity): PostResponseInterface {
    return { post };
  }
}
