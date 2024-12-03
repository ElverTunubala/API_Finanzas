import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../categorys/entities/category.entity';
import { BudgetEntity } from '..';

@Module({
  imports: [TypeOrmModule.forFeature([ TransactionEntity, CategoryEntity, BudgetEntity])],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionsModule {}
