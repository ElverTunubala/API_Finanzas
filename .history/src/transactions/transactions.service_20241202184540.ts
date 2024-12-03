import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity, CategoryType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoryEntity } from '../categorys/entities/category.entity';
import { BudgetEntity } from '../budgets/entities/budget.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: Repository<BudgetEntity>,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<TransactionEntity> {
    const { categoryId, budgetId, amount, type } = createTransactionDto;
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    const budget = await this.budgetRepository.findOne({ where: { id: budgetId } });

    if (!category && !budget) {
      throw new NotFoundException('Category or Budget not found');
    }

    if (type === CategoryType.EXPENSE) {
      if (category) {
        if (category.remainingAmount < amount) {
          throw new BadRequestException('Insufficient category balance');
        }
        category.remainingAmount -= amount;
      } else if (budget) {
        if (budget.remainingAmount < amount) {
          throw new BadRequestException('Insufficient budget balance');
        }
        budget.remainingAmount -= amount;
      }
    } else if (type === CategoryType.INCOME) {
      if (category) {
        category.remainingAmount += amount;
      } else if (budget) {
        budget.remainingAmount += amount;
      }
    }

    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }
}
