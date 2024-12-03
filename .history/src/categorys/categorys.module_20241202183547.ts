import { Module } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CategorysController } from './categorys.controller';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetEntity } from 'src/budgets/entities/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ CategoryEntity,BudgetEntity])],
  controllers: [CategorysController],
  providers: [CategorysService],
})
export class CategorysModule {}
