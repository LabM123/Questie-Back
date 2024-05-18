import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    const foundCategories = await this.categoriesRepository.find();
    if (foundCategories.length === 0) {
      throw new NotFoundException('There are no categories to display');
    }
    return foundCategories;
  }
  
  async findByName(name: string): Promise<Category[] | undefined> {
    // Normalizar y limpiar la cadena de búsqueda
    const normalizedSearchName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    // Obtener todas las categorías
    const allCategories = await this.categoriesRepository.find();
    
    // Filtrar las categorías normalizando y limpiando sus nombres
    const filteredCategories = allCategories.filter(category => {
      const normalizedCategoryName = category.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedCategoryName.includes(normalizedSearchName);
    });
    
    return filteredCategories;
  }

  async findById(id: string) {
    try {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!foundCategory) {
        throw new NotFoundException('Category not found');
      }
      return foundCategory;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { name: createCategoryDto.name },
      });

      if (foundCategory) {
        throw new ConflictException('Category already exists');
      }

      const slug = `${slugify(createCategoryDto.name, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${new Date().getTime()}`;

      const newCategory = this.categoriesRepository.create({
        name: createCategoryDto.name,
        slug,
      });

      const savedCategory = await this.categoriesRepository.save(newCategory);

      return savedCategory;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const foundCategory = await this.categoriesRepository.findOne({
        where: { id },
      });

      if (!foundCategory) {
        throw new NotFoundException('Category not found');
      }

      if (updateCategoryDto.name) {
        const slug = `${slugify(updateCategoryDto.name, {
          lower: true,
          replacement: '-',
          locale: 'en',
        })}-${new Date().getTime()}`;
        foundCategory.slug = slug;
      }

      await this.categoriesRepository.update(id, {
        ...foundCategory,
        ...updateCategoryDto,
      });

      const updatedCategory = await this.categoriesRepository.findOne({
        where: { id },
      });

      return updatedCategory;
    } catch (error: any) {
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
