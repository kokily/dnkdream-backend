import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Post from './Post';
import Comment from './Comment';

@Entity()
class Reply extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  reply_username!: string;

  @Column('text')
  reply_password!: string;

  @Column('text')
  reply_body!: string;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @Column({ nullable: true })
  postId!: string;

  @ManyToOne((type) => Post, (post) => post.replies)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @Column({ nullable: true })
  commentId!: string;

  @ManyToOne((type) => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'commentId' })
  comment!: Comment;
}

export default Reply;
