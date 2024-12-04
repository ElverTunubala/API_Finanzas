import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from '../transactions/entities/transaction.entity';
import { CategoryEntity } from '../categorys';
import { BudgetEntity } from './budget.entity';
import { TransactionType } from './transaction.enum';

export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: Repository<BudgetEntity>,
  ) {}

  // Crear transacción
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<TransactionEntity> {
    try {
      const { categoryId, budgetId, amount, type, userId, description, date } = createTransactionDto;

      // Verificar que al menos uno de categoryId o budgetId esté presente
      if (!categoryId && !budgetId) {
        throw new BadRequestException('Either categoryId or budgetId must be provided');
      }

      let category: CategoryEntity | null = null;
      let budget: BudgetEntity | null = null;

      // Buscar la categoría si categoryId es proporcionado
      if (categoryId) {
        category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
          throw new NotFoundException('Category not found');
        }
      }

      // Buscar el presupuesto si budgetId es proporcionado
      if (budgetId) {
        budget = await this.budgetRepository.findOne({ where: { id: budgetId } });
        if (!budget) {
          throw new NotFoundException('Budget not found');
        }
      }

      // Manejo de la transacción según el tipo (Income o Expense)
      if (type === TransactionType.EXPENSE) {
        if (category) {
          if (category.remainingAmount < amount) {
            throw new BadRequestException('Insufficient category balance');
          }
          // Restamos del remainingAmount de la categoría
          category.remainingAmount -= amount;
        } else if (budget) {
          if (budget.remainingAmount < amount) {
            throw new BadRequestException('Insufficient budget balance');
          }
          // Restamos del remainingAmount del presupuesto
          budget.remainingAmount -= amount;
        }
      } else if (type === TransactionType.INCOME) {
        if (category) {
          // Sumamos al remainingAmount de la categoría
          category.remainingAmount += amount;
        } else if (budget) {
          // Sumamos al remainingAmount del presupuesto
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

      // Crear la transacción
      const transaction = this.transactionRepository.create({
        description,
        amount,
        date,
        type,
        user: { id: userId }, // Asegúrate de que el userId se asigna correctamente
        category,
        budget,
      });

      // Guardar la transacción
      await this.transactionRepository.save(transaction);

      // Guardar los cambios en presupuesto o categoría
      if (category) {
        await this.categoryRepository.save(category);
      } else if (budget) {
        await this.budgetRepository.save(budget);
      }

      return transaction;

    } catch (error) {
      // Manejo de errores
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }
}
