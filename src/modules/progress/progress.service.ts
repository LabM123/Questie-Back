import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Progress } from './entities/progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Lesson } from '../lessons/entities/lesson.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private connection: Connection,
  ) {}

  private async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  private async findLessonById(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new NotFoundException('Lección no encontrada');
    }
    return lesson;
  }

  private async findProgressById(progressId: string): Promise<Progress> {
    const progress = await this.progressRepository.findOne({
      where: { id: progressId },
      relations: ['user', 'lesson'],
    });
    if (!progress) {
      throw new NotFoundException(
        `Progreso con ID ${progressId} no encontrado`,
      );
    }
    return progress;
  }

  async markAsCompleted(
    createProgressDto: CreateProgressDto,
  ): Promise<Progress> {
    const { userId, lessonId } = createProgressDto;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findUserById(userId);
      const lesson = await this.findLessonById(lessonId);

      // Check if the progress already exists
      let progress = await this.progressRepository.findOne({
        where: { user: { id: user.id }, lesson: { id: lesson.id } },
      });

      if (progress) {
        progress.completed = true;
      } else {
        progress = this.progressRepository.create({
          user,
          lesson,
          completed: true,
        });
      }

      const savedProgress = await queryRunner.manager.save(Progress, progress);

      await queryRunner.commitTransaction();
      return savedProgress;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getProgressForUser(
    userId: string,
  ): Promise<{ id: string; userId: string; lessonId: string }[]> {
    await this.findUserById(userId);

    const progressRecords = await this.progressRepository.find({
      where: { user: { id: userId } },
      select: {
        id: true,
        user: { id: true },
        lesson: { id: true },
      },
      relations: ['user', 'lesson'],
    });

    return progressRecords.map((record) => ({
      id: record.id,
      userId: record.user.id,
      lessonId: record.lesson.id,
    }));
  }

  async findOne(id: string): Promise<Progress> {
    return this.findProgressById(id);
  }

  async update(
    id: string,
    updateProgressDto: UpdateProgressDto,
  ): Promise<Progress> {
    const progress = await this.findProgressById(id);

    const updatedProgress = Object.assign(progress, updateProgressDto);
    return this.progressRepository.save(updatedProgress);
  }

  async remove(id: string): Promise<void> {
    const progress = await this.findProgressById(id);
    const result = await this.progressRepository.delete(progress.id);

    if (result.affected === 0) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
  }

  async getModuleProgress(userId: string, moduleId: string) {
    /* const user = await this.findUserById(userId); */

    const lessonsInModule = await this.lessonRepository.find({
      where: { module: { id: moduleId } },
    });

    const completedLessons = await this.progressRepository.find({
      where: {
        user: { id: userId },
        lesson: { module: { id: moduleId } },
        completed: true,
      },
    });

    return {
      totalLessons: lessonsInModule.length,
      completedLessons: completedLessons.length,
      remainingLessons: lessonsInModule.length - completedLessons.length,
    };
  }

  async getCourseProgress(userId: string, courseId: string) {
    /* const user = await this.findUserById(userId); */

    const lessonsInCourse = await this.lessonRepository.find({
      where: { module: { course: { id: courseId } } },
    });

    const completedLessons = await this.progressRepository.find({
      where: {
        user: { id: userId },
        lesson: { module: { course: { id: courseId } } },
        completed: true,
      },
    });

    return {
      totalLessons: lessonsInCourse.length,
      completedLessons: completedLessons.length,
      remainingLessons: lessonsInCourse.length - completedLessons.length,
    };
  }
}
