import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Material from './Material';
import User from './User';

@Entity()
class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  title!: string;

  @Column('text')
  thumbnail!: string;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column()
  serving!: number;

  @Column({ type: 'int', nullable: true })
  all_cost!: number;

  @Column({ type: 'int', nullable: true })
  all_price!: number;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @Column('uuid')
  fk_user_id!: string;

  // Relations
  @ManyToOne((type) => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @OneToMany((type) => Material, (material) => material.recipe)
  materials!: Material[];
}

export default Recipe;
