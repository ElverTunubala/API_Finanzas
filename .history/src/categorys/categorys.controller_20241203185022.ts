import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { CategoryService } from '../categorys/categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
    } catch (error) {
      throw error; 
    }
  }
}