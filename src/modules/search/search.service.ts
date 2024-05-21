import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from '../modules/entities/module.entity';
import { Course } from '../courses/entities/course.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(query: string) {
    const [courses, modules, categories, products] = await Promise.all([
      this.courseRepository.find({ select: ['id', 'title'] }),
      this.moduleRepository.find({ select: ['id', 'title'] }),
      this.categoryRepository.find({ select: ['id', 'name'] }),
      this.productRepository.find({ select: ['id', 'name'] }),
    ]);

    const allResources = [
      ...courses.map((course) => ({
        id: course.id,
        name: course.title,
        type: 'course',
      })),
      ...modules.map((module) => ({
        id: module.id,
        name: module.title,
        type: 'module',
      })),
      ...categories.map((category) => ({
        id: category.id,
        name: category.name,
        type: 'category',
      })),
      ...products.map((product) => ({
        id: product.id,
        name: product.name,
        type: 'product',
      })),
    ];

    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const filtered = allResources.filter((res) => {
      const normalizedResultName = res.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return normalizedResultName.includes(normalizedQuery);
    });

    return filtered;
  }
}
