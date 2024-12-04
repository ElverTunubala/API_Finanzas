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

      // Verificar si el nombre ya está en uso por otra categoría (excepto por la misma categoría que estamos actualizando)
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name, id: Not(id) },
      });
      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }

      // Obtener el presupuesto asociado a la categoría
      const budget = category.budget;
      if (!budget) {
        throw new NotFoundException('Budget not found');
      }

      // Si el campo 'assignedAmount' ha cambiado, actualizamos 'remainingAmount'
      if (updateCategoryDto.assignedAmount !== undefined) {
        const previousAssignedAmount = category.remainingAmount;
        const newAssignedAmount = updateCategoryDto.assignedAmount;

        // Calcular la diferencia
        const difference = newAssignedAmount - previousAssignedAmount;

        // Si la nueva cantidad es mayor, restamos la diferencia del presupuesto
        if (difference > 0) {
          if (budget.remainingAmount < difference) {
            throw new BadRequestException('Insufficient budget to update assigned amount');
          }
          budget.remainingAmount -= difference;
        } 
        // Si la nueva cantidad es menor, devolvemos la diferencia al presupuesto
        else if (difference < 0) {
          budget.remainingAmount += Math.abs(difference);
        }

        // Actualizamos el 'remainingAmount' de la categoría
        category.remainingAmount = newAssignedAmount;
      }

      // Actualizar la categoría con los nuevos datos
      const updatedCategory = Object.assign(category, updateCategoryDto);

      // Guardar los cambios en el presupuesto y la categoría
      await this.budgetRepository.save(budget);
      return await this.categoryRepository.save(updatedCategory);

    } catch (error) {
      // Manejo de excepciones: si ya es un error conocido, lanzarlo, de lo contrario lanzar un error genérico
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }
}