import { IsString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsNumber()
  assignedAmount: number;

  @IsNumber()
  remainingAmount: number;
}
