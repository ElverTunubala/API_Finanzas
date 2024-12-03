import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categorys/entities/category.entity';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

export enum BudgetStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  OVERDUE = 'Overdue',
}

@Entity()
export class BudgetEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, user => user.budgets)
  user: UserEntity;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('decimal')
  totalAmount: number;

  @Column('decimal')
  remainingAmount: number;

  @Column({ type: 'enum', enum: BudgetStatus })
  status: BudgetStatus;

  @OneToMany(() => CategoryEntity, category => category.budget)
  categories: CategoryEntity[];

  @OneToMany(() => TransactionEntity, transaction => transaction.budget)
  transactions: TransactionEntity[];
}
