import { IsString, IsNotEmpty, IsNumber, IsDateString, IsDate, IsEnum } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  amount: number;
  
  @IsDate()
  @IsDateString()
  date: Date = new Date();

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsString()
  categoryId: string;

  @IsString()
  budgetId: string;

  @IsString()
  userId: string;
}

