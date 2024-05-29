import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Course } from '../courses/entities/course.entity';
import { Module } from '../modules/entities/module.entity';
import { Content } from '../contents/entities/content.entity';
import { Lesson } from '../lessons/entities/lesson.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { polymorphicEntityId, polymorphicEntityType } = createProductDto;
    if (polymorphicEntityId && polymorphicEntityType) {
      if (
        !['Course', 'Module', 'Lesson', 'Content'].includes(
          polymorphicEntityType,
        )
      ) {
        throw new NotFoundException('Invalid entity type');
      }

      let entity = null;
      switch (polymorphicEntityType) {
        case 'Course':
          entity = await this.courseRepository.findOne({
            where: { id: polymorphicEntityId },
          });
          entity.isProduct = true;
          await this.courseRepository.update(polymorphicEntityId, entity);
          break;
        case 'Module':
          entity = await this.moduleRepository.findOne({
            where: { id: polymorphicEntityId },
          });
          break;
        case 'Lesson':
          entity = await this.lessonRepository.findOne({
            where: { id: polymorphicEntityId },
          });
          break;
        case 'Content':
          entity = await this.contentRepository.findOne({
            where: { id: polymorphicEntityId },
          });
          break;
      }

      if (!entity) {
        throw new NotFoundException(`Entity not found`);
      }
    }

    const order = (await this.productRepository.count()) + 1;

    return await this.productRepository.save(
      this.productRepository.create({
        ...createProductDto,
        order,
      }),
    );
  }

  async findAll(withDeleted: boolean = false): Promise<Product[]> {
    return await this.productRepository.find({ withDeleted });
  }

  async findOne(id: string, withDeleted: boolean = false): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      withDeleted,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{ id: string }> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    const updatedProduct = await this.productRepository.update(
      id,
      updateProductDto,
    );

    if (updatedProduct.affected <= 0) {
      throw new InternalServerErrorException(`Product not updated`);
    }

    return { id };
  }

  async remove(id: string): Promise<{ id: string }> {
    const product = this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    const idCourse = (await product).polymorphicEntityId;

    await this.courseRepository.update(idCourse, {
      isProduct: false,
    });

    const deletedProduct = await this.productRepository.update(id, {
      deleted_at: new Date(),
    });

    if (deletedProduct.affected <= 0) {
      throw new InternalServerErrorException(`Product not deleted`);
    }

    return { id };
  }
}
