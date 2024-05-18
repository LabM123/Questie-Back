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
      select: ['title', 'description', 'headline'],
    });

    const modules = await this.moduleRepository.find({
      select: ['title', 'id', 'description'],
    });

    const categories = await this.categoriesRepository.find({
      select: ['name'],
    });

    const products = await this.productsRepository.find({
      select: ['name', 'description'],
    });

    const todosResultados = [
      ...courses,
      ...modules,
      ...products,
      ...categories,
    ];

    return todosResultados;
  }
}
