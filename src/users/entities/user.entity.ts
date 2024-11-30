import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { BudgetEntity } from '../../budgets/entities/budget.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'timestamptz' })
  registrationDate: Date;

  @Column()
  currency: string;

  @OneToMany(() => BudgetEntity, budget => budget.user)
  budgets: BudgetEntity[];

  @OneToMany(() => TransactionEntity, transaction => transaction.user)
  transactions: TransactionEntity[];
}
