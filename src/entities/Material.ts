import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import Recipe from './Recipe';

@Entity()
class Material extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  fk_recipe_id!: string;

  @Column('text')
  name!: string;

  @Column('text')
  divide!: string;

  @Column('text')
  unit!: string;

  @Column({ type: 'decimal', scale: 1 })
  usage!: number;

  @Column()
  price!: number;

  @Column()
  cost!: number;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @ManyToOne((type) => Recipe, (recipe) => recipe.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_recipe_id' })
  recipe!: Recipe;
}

export default Material;
