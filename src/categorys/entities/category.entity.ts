import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BudgetEntity } from '../../budgets/entities/budget.entity';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

export enum CategoryType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => BudgetEntity, budget => budget.categories)
  budget: BudgetEntity;

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType;

  @Column('decimal')
  allocatedAmount: number;

  @Column('decimal')
  remainingAmount: number;

  @OneToMany(() => TransactionEntity, transaction => transaction.category)
  transactions: TransactionEntity[];
}
