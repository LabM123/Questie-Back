import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoriesRepository: Repository<Category>,
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
  ){}

  async findAll() {
    try {
      const allCategories = await this.categoriesRepository.find();
      return allCategories;
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const foundedCategory = await this.categoriesRepository.findOne({where: {id}});
      if(!foundedCategory) throw new BadRequestException('Category not found')
      return foundedCategory;
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { courses_id } = createCategoryDto;
      const courses = [];
      for (let i = 0; i < courses_id.length; i++) {
        const course_id = courses_id[i];
        const foundedCourse = await this.coursesRepository.findOne({ where: { id: course_id } });
        if (!foundedCourse) throw new BadRequestException(`Course not found, id: ${course_id}`);
        courses.push(foundedCourse);
      }
      const newCategory = this.categoriesRepository.create({ name: createCategoryDto.name, courses });
      const savedCategory = await this.categoriesRepository.save(newCategory);
      return savedCategory;
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }
  
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const foundedCategory = await this.categoriesRepository.findOne({where:{id}});
      if(!foundedCategory) throw new BadRequestException('Category not found')
      if(updateCategoryDto.courses_id && updateCategoryDto.name){
        const { courses_id } = updateCategoryDto;
        const courses = [];
        for (let i = 0; i < courses_id.length; i++) {
          const course_id = courses_id[i];
          const foundedCourse = await this.coursesRepository.findOne({ where: { id: course_id } });
          if (!foundedCourse) throw new BadRequestException(`Course not found, id: ${course_id}`);
          courses.push(foundedCourse);
        }
        const updatedCategory = await this.categoriesRepository.update(id, {name: updateCategoryDto.name, courses});
        return updatedCategory;
      }
      const updatedCategory = await this.categoriesRepository.update(id, {name: updateCategoryDto.name, ...foundedCategory});
      return updatedCategory;
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    const foundedCategory = await this.categoriesRepository.findOne({where: {id}});
    if(!foundedCategory) throw new BadRequestException('Category not found')
    foundedCategory.deleted_at = new Date();
    const deletedCategory = await this.categoriesRepository.update(id, foundedCategory);
    return deletedCategory;
  }
}
