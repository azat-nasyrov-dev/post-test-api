import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';
import { PostEntity } from '../../posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ example: 'f7f4aa10-f760-42d9-ac5e-2379deb726a7', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'johndoe@gmail.com', description: 'Email' })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({ example: '123', description: 'User password' })
  @Column({ nullable: false, select: false })
  password: string;

  @ApiProperty({ example: 'John', description: 'Username' })
  @Column({ nullable: true })
  username?: string;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];
}
