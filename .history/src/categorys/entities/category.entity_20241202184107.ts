import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BudgetEntity } from '../../budgets/entities/budget.entity';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

@Entity()
export class CategoryEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => BudgetEntity, budget => budget.categories)
  budget: BudgetEntity;

  

  @Column('decimal')
  allocatedAmount: number;

  @Column('decimal')
  remainingAmount: number;

  @OneToMany(() => TransactionEntity, transaction => transaction.category)
  transactions: TransactionEntity[];
  
}
