import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from '../transactions/entities/transaction.entity';
import { CategoryEntity } from '../categorys/entities/category.entity';
import { BudgetEntity } from '../budgets/entities/budget.entity';
import { TransactionType } from '../transactions/entities/transaction.entity';

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
      const { categoryId, budgetId, amount, type, userId, description, date } = createTransactionDto;
      console.log("categoriaId: ",categoryId, "presopuestoId: ",budgetId)

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
        }
      } else if (type === TransactionType.INCOME) {
        if (category) {
          category.remainingAmount += amount;
        } else if (budget) {
         
          budget.remainingAmount += amount;
        }
      } else {
        throw new BadRequestException('Invalid transaction type');
      }

      // Si la transacción es de tipo 'Income' o 'Expense', también debemos actualizar el total_amount de presupuesto o categoría
      if (type === TransactionType.INCOME) {
        if (category) {
          category.assignedAmount += amount;
        } else if (budget) {
          budget.totalAmount += amount;
        }
      } else if (type === TransactionType.EXPENSE) {
        if (category) {
          category.assignedAmount -= amount;
        } else if (budget) {
          budget.totalAmount -= amount;
        }
      }

      const transaction = this.transactionRepository.create({
        description,
        amount,
        date,
        type,
        user: { id: userId }, 
        budget,
      });
      console.log("tras",transaction);
      await this.transactionRepository.save(transaction);

      if (category) {
        await this.categoryRepository.save(category);
      } else if (budget) {
        await this.budgetRepository.save(budget);
      }

      return transaction;

    } catch (error) {
     
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }
}
