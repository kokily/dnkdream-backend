import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import bcrypt from 'bcryptjs';
import Comment from './Comment';
import Reply from './Reply';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  username!: string;

  @Column({ type: 'text', nullable: true })
  @IsEmail()
  email!: string | null;

  @Column({ type: 'text', nullable: true })
  password!: string | null;

  @Column({ type: 'text', nullable: true })
  profile!: string | null;

  @Column({ type: 'boolean', default: false })
  admin!: boolean;

  @Column({ type: 'text', nullable: true })
  verify_key!: string | null;

  @Column({ type: 'boolean', default: false })
  verified!: boolean;

  @Column({ type: 'text', default: null, nullable: true })
  githubId!: string | null;

  @Column({ type: 'text', default: null, nullable: true })
  googleId!: string | null;

  @Column({ type: 'text', default: null, nullable: true })
  kakaoId!: string | null;

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany((type) => Comment, (comment) => comment.user, {
    onDelete: 'CASCADE',
  })
  comments!: Comment[];

  @OneToMany((type) => Reply, (reply) => reply.user, {
    onDelete: 'CASCADE',
  })
  replies!: Reply[];

  private hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  public setPassword = async (password: string): Promise<void> => {
    this.password = await this.hashPassword(password);
  };

  public validPassword = async (password: string): Promise<boolean> => {
    if (this.password) {
      return await bcrypt.compare(password, this.password);
    } else {
      return false;
    }
  };
}

export default User;
