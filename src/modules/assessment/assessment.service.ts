import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Assessment } from './entities/assessment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentsRepository: Repository<Assessment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async createAssessment(
    createAssessmentDto: CreateAssessmentDto,
  ): Promise<Assessment> {
    const { userId, courseId, score } = createAssessmentDto;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }

    const existingAssessment = await this.assessmentsRepository.findOne({
      where: { user, course },
    });
    if (existingAssessment) {
      throw new ConflictException('User has already assessed this course');
    }

    const assessment = new Assessment();
    assessment.score = score;
    assessment.user = user;
    assessment.course = course;

    return this.assessmentsRepository.save(assessment);
  }

  async getAssessmentsForCourse(courseId: string): Promise<Assessment[]> {
    return this.assessmentsRepository.find({
      where: { course: { id: courseId } },
      relations: ['user', 'course'],
    });
  }

  async getScores(courseId: string): Promise<Assessment[] | any> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const assessments = await this.assessmentsRepository.find({
      where: { course: { id: courseId } },
      relations: ['user', 'course'],
    });

    if (!assessments || assessments.length === 0) {
      return { averageScore: 0, totalAssessments: 0, maxScore: 0, minScore: 0 };
    }

    const totalScore = assessments.reduce(
      (sum, assessment) => sum + assessment.score,
      0,
    );
    const averageScore = totalScore / assessments.length;

    const scores = assessments.map((a) => a.score);

    const totalAssessments = assessments.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    return { averageScore, totalAssessments, maxScore, minScore };
  }

  async findAll(): Promise<Assessment[]> {
    return this.assessmentsRepository.find({
      relations: ['user', 'course'],
    });
  }

  async findOne(id: string): Promise<Assessment> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id: id },
    });
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return assessment;
  }

  async update(
    id: string,
    updateAssessmentDto: UpdateAssessmentDto,
  ): Promise<Assessment> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    const { score } = updateAssessmentDto;
    assessment.score = score;

    return this.assessmentsRepository.save(assessment);
  }

  async remove(id: string): Promise<void> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    await this.assessmentsRepository.update(id, {});
  }
}
