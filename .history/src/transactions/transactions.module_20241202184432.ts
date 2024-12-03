import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categorys/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ TransactionEntity, CategoryEntity])],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionsModule {}
