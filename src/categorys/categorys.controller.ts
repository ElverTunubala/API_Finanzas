import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from '../categorys/categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(':budgetId')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Param('budgetId') budgetId: string) {
    return await this.categoryService.createCategory(createCategoryDto, budgetId);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

   // Endpoint para obtener todas las categorías de un usuario por su ID
  @Get('user/:userId')
  async findCategoriesByUserId(@Param('userId') userId: string): Promise<CategoryEntity[]> {
    return await this.categoryService.findCategoriesByUserId(userId);
  }
  
}