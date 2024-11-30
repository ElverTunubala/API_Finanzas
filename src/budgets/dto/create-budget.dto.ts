import { IsString, IsNotEmpty, IsDateString, IsEnum, IsNumber, IsDate } from 'class-validator';
import { BudgetStatus } from '../entities/budget.entity';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsDate()
  @IsDateString()
  startDate: string;
  
  @IsDate()
  @IsDateString()
  endDate: string;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  remainingAmount: number;

  @IsEnum(BudgetStatus)
  status: BudgetStatus;
}
