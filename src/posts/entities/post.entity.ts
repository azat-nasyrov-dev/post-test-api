import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'posts' })
export class PostEntity {
  @ApiProperty({ example: '4cf0f6d8-90b4-4b24-bbb9-318a840f2d6f', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'New post', description: 'Title' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ example: 'Some description', description: 'Description' })
  @Column({ nullable: false, default: '' })
  description: string;

  @ApiProperty({ example: '29.01.2024', description: 'Date of creation' })
  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ example: '29.01.2024', description: 'Date of update' })
  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.posts, { eager: true })
  author: UserEntity;
}
