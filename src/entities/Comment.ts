import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Post from './Post';
import Reply from './Reply';

@Entity()
class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  comment_username!: string;

  @Column('text')
  comment_password!: string;

  @Column('text')
  comment_body!: string;

  @Column({ type: 'boolean', default: false })
  deleted!: boolean;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @Column({ nullable: true })
  postId!: string;

  @ManyToOne((type) => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @OneToMany((type) => Reply, (reply) => reply.comment)
  replies!: [Reply];
}

export default Comment;
