import { Module } from '@nestjs/common';
import { BudgetService } from './budgets.service';
import { BudgetController } from './budgets.controller';
import { BudgetEntity } from './entities/budget.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ BudgetEntity,UserEntity])],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetsModule {}
