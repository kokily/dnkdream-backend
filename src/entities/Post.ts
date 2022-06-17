import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Comment from './Comment';
import Reply from './Reply';

@Entity()
class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  category!: string;

  @Column('text')
  title!: string;

  @Column('text')
  body!: string;

  @Column({ type: 'text', nullable: true })
  thumbnail!: string | null;

  @Column('simple-array')
  tags!: string[];

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany((type) => Comment, (comment) => comment.post, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  comments!: Comment[];

  @OneToMany((type) => Reply, (reply) => reply.post, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  replies!: Reply[];
}

export default Post;
