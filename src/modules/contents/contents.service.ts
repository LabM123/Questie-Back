import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private contentsRepository: Repository<Content>,
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
  ) {}

  async findAll(withDeleted: boolean = false) {
    try {
      const contents = await this.contentsRepository.find({
        withDeleted,
        loadRelationIds: true,
      });
      if (contents.length === 0)
        throw new NotFoundException('There are no contents to display');
      return contents;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const foundContent = await this.contentsRepository.findOne({
        where: { id },
        loadRelationIds: true,
      });
      if (!foundContent) throw new BadRequestException('Content not found');

      return foundContent;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const { lesson_id, contents } = createContentDto;

    try {
      const foundLesson = await this.lessonsRepository.findOne({
        where: { id: lesson_id },
        loadRelationIds: true,
      });

      if (!foundLesson) throw new NotFoundException('Lesson not found');

      const newContent = this.contentsRepository.create({
        content: contents.content,
        lesson: foundLesson,
        type: contents.type,
      });

      return await this.contentsRepository.save(newContent);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    try {
      const foundContent = await this.contentsRepository.findOne({
        where: { id },
        loadRelationIds: true,
      });
      if (!foundContent) throw new NotFoundException('Content not found');

      const savedContent = await this.contentsRepository.update(
        id,
        updateContentDto,
      );
      return savedContent;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const foundContent = await this.contentsRepository.findOne({
        where: { id },
      });
      if (!foundContent) throw new BadRequestException('Content not found');

      const deletedContent = await this.contentsRepository.update(id, {
        deleted_at: new Date(),
      });

      if (deletedContent.affected <= 0)
        throw new BadRequestException('Content not deleted');

      return await this.contentsRepository.findOne({
        where: { id },
        loadRelationIds: true,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
