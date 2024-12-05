import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetEntity } from '../budgets/entities/budget.entity';
import { CategoryEntity } from '../categorys/entities/category.entity';
import { TransactionEntity, TransactionType } from '../transactions/entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

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
    try {
      const { categoryId, budgetId, amount, type, userId, description,date } = createTransactionDto;
    
      if (!categoryId && !budgetId) {
        throw new BadRequestException('Either categoryId or budgetId must be provided');
      }

      let category: CategoryEntity | null = null;
      let budget: BudgetEntity | null = null;

      if (categoryId) {
        category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
          throw new NotFoundException('Category not found');
        }
      }

      if (budgetId) {
        budget = await this.budgetRepository.findOne({ where: { id: budgetId } });
        if (!budget) {
          throw new NotFoundException('Budget not found');
        }
      }

      if (type === TransactionType.EXPENSE) {
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
          budget.totalAmount -= amount;
        }
      } else if (type === TransactionType.INCOME) {

        if (category) {
          category.remainingAmount = amount+Number(category.remainingAmount);
          category.assignedAmount = amount+Number(category.assignedAmount);

        } else if (budget) {
          budget.remainingAmount = amount+Number(budget.remainingAmount);
          budget.totalAmount = amount+Number(budget.totalAmount);
        }
      } else {
        throw new BadRequestException('Invalid transaction type');
      }

      const transaction = this.transactionRepository.create({
        description,
        amount,
        date: date || new Date(),
        type,
        user: { id: userId },
        budget,
      });
      
      await this.transactionRepository.save(transaction);

      if (category) {
        await this.categoryRepository.save(category);
      } else if (budget) {
        await this.budgetRepository.save(budget);
      }

      return transaction;

    } catch (error) {
      console.error('Error en el servicio de transacción:', error);
     
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`An unexpected error occurred: ${error.message || error}`);
    }
  }

   // Método para listar transacciones por ID de usuario
  async findTransactionsByUserId(userId: string): Promise<TransactionEntity[]> {
    try {
      const transactions = await this.transactionRepository.find({
        where: { user: { id: userId } },
        relations: ['category', 'budget'],
      });

      if (!transactions.length) {
        throw new NotFoundException(`No transactions found for user with id ${userId}`);
      }
      return transactions;
    } catch (error) {
      throw new BadRequestException('An unexpected error occurred while fetching transactions');
    }
  }
  
}
