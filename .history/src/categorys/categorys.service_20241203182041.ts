import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
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
    try {
      // Validación: Verificar si el presupuesto existe
      const budget = await this.budgetRepository.findOne({ where: { id: budgetId } });
      if (!budget) {
        throw new NotFoundException('Budget not found');
      }

      // Validación: Verificar si el presupuesto tiene suficiente monto disponible
      if (budget.remainingAmount < createCategoryDto.assignedAmount) {
        throw new BadRequestException('Insufficient budget');
      }

      // Validación: Verificar si el nombre de la categoría ya existe
      const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }

      // Crear la nueva categoría
      const category = this.categoryRepository.create({ ...createCategoryDto, budget });
      category.remainingAmount = createCategoryDto.assignedAmount;
      budget.remainingAmount -= createCategoryDto.assignedAmount;

      // Guardar los cambios en el presupuesto
      await this.budgetRepository.save(budget);

      // Guardar la categoría
      return await this.categoryRepository.save(category);
    } catch (error) {
      // Manejo de errores, lanzamos el error adecuado
      throw error; // Este error se captura por el controlador
    }
  }
}