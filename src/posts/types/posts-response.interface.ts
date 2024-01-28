import { PostEntity } from '../entities/post.entity';

export interface PostsResponseInterface {
  posts: PostEntity[];
  postsCount: number;
}
