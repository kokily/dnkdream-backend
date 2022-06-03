import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  @Column({ type: 'int', default: 1 })
  count!: number;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;
}

export default Tag;
