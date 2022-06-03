import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}

export default Post;
