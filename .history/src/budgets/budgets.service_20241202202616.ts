import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetEntity, BudgetStatus } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UserEntity } from '../users/entities/user.entity';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: Repository<BudgetEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createBudget(createBudgetDto: CreateBudgetDto, userId: string): Promise<BudgetEntity> {
    try {
  
      if (!validateUuid(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }
  
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const existingBudget = await this.budgetRepository.findOne({ where: { user: { id: userId } } });
      if (existingBudget) {
        throw new BadRequestException('User can only create one budget. Please update the existing one.');
      }
  
      // Validar la fecha de inicio
      if (new Date(createBudgetDto.startDate) < new Date()) {
        throw new BadRequestException('Start date must be in the future');
      }
  
      // Crear el presupuesto
      const budget = this.budgetRepository.create({ ...createBudgetDto, user });
      budget.remainingAmount = createBudgetDto.totalAmount;
      budget.status = BudgetStatus.ACTIVE;
  
      // Guardar el presupuesto
      return await this.budgetRepository.save(budget);
  
    } catch (error) {
      // Manejo de errores genéricos, en caso de cualquier excepción
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;  // Si ya es una excepción conocida, la lanzamos tal cual
      }
  
      // Manejo de errores inesperados
      throw new BadRequestException('An unexpected error occurred');
    }
  }
  

  async getBudgets(userId: string): Promise<BudgetEntity[]> {
    return await this.budgetRepository.find({ where: { user: { id: userId } } });
  }

  async updateBudgetStatus(): Promise<void> {
    const budgets = await this.budgetRepository.find();

    budgets.forEach(async (budget) => {
      if (new Date() > new Date(budget.endDate)) {
        budget.status = BudgetStatus.EXPIRED;
        await this.budgetRepository.save(budget);
      }
    });
  }
}