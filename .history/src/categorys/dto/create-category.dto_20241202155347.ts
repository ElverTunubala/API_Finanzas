import { IsString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';


export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  assignedAmount: number;

  @IsNumber()
  remainingAmount: number;
}
