import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { BudgetService } from '../budgets/budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async createBudget(@Body() createBudgetDto: CreateBudgetDto, @Query('userId') userId: string) {
    return await this.budgetService.createBudget(createBudgetDto, userId);
  }

  @Get(':userId')
  async getBudgets(@Param('userId') userId: string) {
    return await this.budgetService.getBudgets(userId);
  }

  
}