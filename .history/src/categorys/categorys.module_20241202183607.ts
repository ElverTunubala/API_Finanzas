import { Module } from '@nestjs/common';
import { CategoryService } from './categorys.service';
import { CategoryController } from './categorys.controller';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetEntity } from '../';

@Module({
  imports: [TypeOrmModule.forFeature([ CategoryEntity,BudgetEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategorysModule {}
