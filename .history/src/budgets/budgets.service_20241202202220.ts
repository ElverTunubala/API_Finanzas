import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetEntity, BudgetStatus } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: Repository<BudgetEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  

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