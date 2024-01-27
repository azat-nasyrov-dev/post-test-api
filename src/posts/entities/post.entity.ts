import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, default: '' })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
