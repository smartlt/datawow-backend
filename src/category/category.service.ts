import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../post/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    // Check if category already exists
    const existingCategory = await this.categoryModel
      .findOne({ name: createCategoryDto.name })
      .exec();
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    // Create new category
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOneCategory(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.categoryModel.findById(id).exec();
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // Check for duplicate name if changing the name
    if (updateCategoryDto.name) {
      const duplicateCategory = await this.categoryModel
        .findOne({ name: updateCategoryDto.name, _id: { $ne: id } })
        .exec();
      if (duplicateCategory) {
        throw new ConflictException('Category name already exists');
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException('Category not found after update');
    }

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<Category> {
    // Check if category exists
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Delete the category
    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCategory) {
      throw new NotFoundException('Category not found after deletion');
    }

    return deletedCategory;
  }
}
