import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../categorys/entities/category.entity';
import { BudgetEntity } from '../budgets/entities/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ TransactionEntity, CategoryEntity, BudgetEntity])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionsModule {}
