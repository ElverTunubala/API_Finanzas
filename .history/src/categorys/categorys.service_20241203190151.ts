import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BudgetEntity } from '../budgets/entities/budget.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: Repository<BudgetEntity>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, budgetId: string): Promise<CategoryEntity> {
    try {
      
      const budget = await this.budgetRepository.findOne({ where: { id: budgetId } });
      if (!budget) {
        throw new NotFoundException('Budget not found');
      }

      if (budget.remainingAmount < createCategoryDto.assignedAmount) {
        throw new BadRequestException('Insufficient budget');
      }

      const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }

      const category = this.categoryRepository.create({ ...createCategoryDto, budget });
      category.remainingAmount = createCategoryDto.assignedAmount;
      budget.remainingAmount -= createCategoryDto.assignedAmount;

      await this.budgetRepository.save(budget);

      return await this.categoryRepository.save(category);

    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error; 
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    try {

      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name, id: Not(id) },
      });

      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }
      // Si el campo 'assignedAmount' fue actualizado, también debemos actualizar 'remainingAmount'
      if (updateCategoryDto.assignedAmount !== undefined) {
        category.remainingAmount = updateCategoryDto.assignedAmount;
      }


      const updatedCategory = Object.assign(category, updateCategoryDto);

      return await this.categoryRepository.save(updatedCategory);

    } catch (error) {

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error; 
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }
}