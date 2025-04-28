import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from '../post/entities/category.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new category for posts',
  })
  @ApiCreatedResponse({
    description: 'Category successfully created',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all categories',
  })
  @ApiOkResponse({
    description: 'List of all categories',
    type: [Category],
  })
  findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieves a specific category by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Category details',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  findOneCategory(@Param('id') id: string) {
    return this.categoryService.findOneCategory(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates a category with the provided data',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Category successfully updated',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Deletes a category',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Category successfully deleted',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
