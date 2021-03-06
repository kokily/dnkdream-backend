import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Comment from './Comment';
import Reply from './Reply';

@Entity()
class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  category!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'text', nullable: true })
  thumbnail!: string | null;

  @Column({ type: 'simple-array' })
  tags!: string[];

  @Column({ type: 'int', default: 0 })
  counter!: number;

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany((type) => Comment, (comment) => comment.post, {
    onDelete: 'CASCADE',
  })
  comments!: Comment[];

  @OneToMany((type) => Reply, (reply) => reply.post, {
    onDelete: 'CASCADE',
  })
  replies!: Reply[];
}

export default Post;
