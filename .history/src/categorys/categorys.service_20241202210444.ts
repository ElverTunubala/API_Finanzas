import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BudgetEntity } from '../budgets/entities/budget.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: Repository<BudgetEntity>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, budgetId: string): Promise<CategoryEntity> {
    const budget = await this.budgetRepository.findOne({ where: { id: budgetId } });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.remainingAmount < createCategoryDto.assignedAmount) {
      throw new BadRequestException('Insufficient budget');
    }

    const category = this.categoryRepository.create({ ...createCategoryDto, budget });
    category.remainingAmount=
    budget.remainingAmount -= createCategoryDto.assignedAmount;
    await this.budgetRepository.save(budget);

    return await this.categoryRepository.save(category);
  }
}