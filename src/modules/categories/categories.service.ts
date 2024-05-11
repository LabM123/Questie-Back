import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    const foundCategories = await this.categoriesRepository.find();
    if (foundCategories.length === 0) {
      throw new NotFoundException("There are no categories to display");
    }
    return foundCategories;
  }
  
  async findById(id: string) {
    try {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!foundCategory) {
        throw new NotFoundException("Category not found");
      }
      return foundCategory;
    } catch (error : any) {
      throw new BadRequestException(error.message);
    }
  }
  
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { name: createCategoryDto.name },
      });
      if (foundCategory) {
        throw new ConflictException("Category already exists");
      }
      const newCategory = this.categoriesRepository.create({
        name: createCategoryDto.name,
      });
      const savedCategory = await this.categoriesRepository.save(newCategory);
      return savedCategory;
    } catch (error : any) {
      throw new BadRequestException(error.message);
    }
  }
  
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!foundCategory) {
        throw new NotFoundException("Category not found");
      }
      await this.categoriesRepository.update(id, updateCategoryDto);
      const updatedCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      return updatedCategory;
    } catch (error : any) {
      throw new BadRequestException(error.message);
    }
  }
  
  async remove(id: string) {
    try {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!foundCategory) {
        throw new NotFoundException('Category not found');
      }
      foundCategory.deleted_at = new Date();
      await this.categoriesRepository.update(id, foundCategory);
      const removedCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      console.log(removedCategory);
      return removedCategory;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
