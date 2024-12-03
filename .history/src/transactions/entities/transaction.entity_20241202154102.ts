import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { BudgetEntity } from '../../budgets/entities/budget.entity';
import { CategoryEntity } from '../../categorys/entities/category.entity';

export enum CategoryType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

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

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType;

  @ManyToOne(() => CategoryEntity, category => category.transactions)
  category: CategoryEntity;

  @ManyToOne(() => BudgetEntity, budget => budget.transactions)
  budget: BudgetEntity;

  @ManyToOne(() => UserEntity, user => user.transactions)
  user: UserEntity;
}
