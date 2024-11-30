import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { BudgetEntity } from '../../budgets/entities/budget.entity';
import { CategoryEntity } from '../../categorys/entities/category.entity';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal')
  amount: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => CategoryEntity, category => category.transactions)
  category: CategoryEntity;

  @ManyToOne(() => BudgetEntity, budget => budget.transactions)
  budget: BudgetEntity;

  @ManyToOne(() => UserEntity, user => user.transactions)
  user: UserEntity;
}
