import { BadRequestException, Injectable } from '@nestjs/common';
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
    @InjectRepository(Lesson) private lessonssRepository: Repository<Lesson>
  ){}

  async findAll() {
    try {
      const allContent = await this.contentsRepository.find();
      return allContent; 
    } catch (error:any) {
      throw new BadRequestException(error.message)
    }
  }
  
  async findOne(id: string) {
    try {
      const foundedContent = await this.contentsRepository.findOne({where:{id}});
      if(!foundedContent) throw new BadRequestException('Content not found');
      return foundedContent;
    } catch (error:any) {
      throw new BadRequestException(error.message)
    }
  }
  
  async create(createContentDto: CreateContentDto) {
    try {
      const foundedLesson = await this.lessonssRepository.findOne({where:{id: createContentDto.lesson_id}});
      if(!foundedLesson) throw new BadRequestException('Lesson not found');
      const newContent = await this.contentsRepository.save({type: createContentDto.type, content: createContentDto.content, lesson: foundedLesson});
      return newContent;
    } catch (error:any) {
      throw new BadRequestException(error.message)
    }
  }
  
  async update(id: string, updateContentDto: UpdateContentDto) {
    try {
      const foundedContent = await this.contentsRepository.findOne({where:{id}});
      if(!foundedContent) throw new BadRequestException('Content not found');
      const savedContent = await this.contentsRepository.update(id, updateContentDto);
      return savedContent;
    } catch (error:any) {
      throw new BadRequestException(error.message)
    }
  }
  
  async remove(id: string) {
    try {
      const foundedContent = await this.contentsRepository.findOne({where:{id}});
      if(!foundedContent) throw new BadRequestException('Content not found');
      foundedContent.deleted_at = new Date();
      const deletedContent = await this.contentsRepository.update(id, foundedContent);
      return deletedContent;
    } catch (error:any) {
      throw new BadRequestException(error.message)
    }
  }
}
