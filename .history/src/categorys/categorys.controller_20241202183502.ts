import { Controller, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from '../categorys';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(':budgetId')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Param('budgetId') budgetId: string) {
    return await this.categoryService.createCategory(createCategoryDto, budgetId);
  }
}