import { IsString, IsNotEmpty, IsNumber, IsDateString, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  amount: number;
  
  @IsDate()
  @IsDateString()
  date: Date = new Date();

  @IsString()
  categoryId: string;

  @IsString()
  budgetId: string;

  @IsString()
  userId: string;
}

