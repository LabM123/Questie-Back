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
    private usersRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async createAssessment(
    createAssessmentDto: CreateAssessmentDto,
  ): Promise<Assessment> {
    const { userId, courseId, score } = createAssessmentDto;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!user || !course) {
      throw new NotFoundException('User or Course not found');
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

  findAll() {
    return `This action returns all assessment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assessment`;
  }

  update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    return `This action updates a #${id} assessment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assessment`;
  }
}
