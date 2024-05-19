import { Injectable } from '@nestjs/common';
import { Module as moduleEntity } from '../modules/entities/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(moduleEntity)
    private moduleRepository: Repository<moduleEntity>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  async findAll() {
    const courses = await this.courseRepository.find({
      select: ['id', 'title'],
    });

    const modules = await this.moduleRepository.find({
      select: ['id', 'title'],
    });

    const categories = await this.categoriesRepository.find({
      select: ['id', 'name'],
    });

    const products = await this.productsRepository.find({
      select: ['id', 'name'],
    });

    // Agregar un tipo a cada elemento y luego combinarlos en un solo array
    const allResult = [
      ...courses.map((course) => ({ ...course, type: 'course' })),
      ...modules.map((module) => ({ ...module, type: 'module' })),
      ...products.map((product) => ({ ...product, type: 'product' })),
      ...categories.map((category) => ({ ...category, type: 'category' })),
    ];

    function convertirTitleToName(allResources: any[]): any[] {
      return allResources.map((resource) => {
        if ('title' in resource) {
          const { title, ...resto } = resource;
          return { ...resto, name: title };
        } else {
          return resource;
        }
      });
    }

    const allResources = convertirTitleToName(allResult);

    return allResources;
  }
}
