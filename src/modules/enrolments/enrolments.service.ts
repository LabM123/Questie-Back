import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnrolmentsService {
  constructor(
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(createEnrolmentDto: CreateEnrolmentDto): Promise<Enrolment> {
    const { userId, courseId } = createEnrolmentDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrolmentExists = await this.enrolmentRepository.findOne({
      where: { user, course },
      withDeleted: true,
    });
    if (enrolmentExists) {
      throw new Error('User already enrolled in this course');
    }

    const newEnrolment = await this.enrolmentRepository.save(
      this.enrolmentRepository.create({
        user,
        course,
      }),
    );

    return await this.enrolmentRepository.findOne({
      where: { id: newEnrolment.id },
      relations: ['user', 'course'],
      loadRelationIds: true,
    });
  }

  async findAll(withDeleted: boolean = false): Promise<Enrolment[]> {
    return await this.enrolmentRepository.find({
      withDeleted,
      relations: ['user', 'course'],
      loadRelationIds: true,
    });
  }

  async findOne(id: string): Promise<Enrolment> {
    const enrolment = await this.enrolmentRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
      loadRelationIds: true,
    });

    if (!enrolment) {
      throw new NotFoundException('Enrolment not found');
    }

    return enrolment;
  }

  async update(
    id: string,
    updateEnrolmentDto: UpdateEnrolmentDto,
  ): Promise<{ id: string }> {
    const enrolment = await this.enrolmentRepository.findOne({
      where: { id },
    });

    if (!enrolment) {
      throw new NotFoundException('Enrolment not found');
    }

    const updatedEnrolment = await this.enrolmentRepository.update(id, {
      ...enrolment,
      ...updateEnrolmentDto,
    });

    if (updatedEnrolment.affected <= 0) {
      throw new InternalServerErrorException('Enrolment not updated');
    }

    return { id };
  }

  async remove(id: string): Promise<{ id: string }> {
    const enrolment = await this.enrolmentRepository.findOne({
      where: { id },
    });

    if (!enrolment) {
      throw new NotFoundException('Enrolment not found');
    }

    const updatedEnrolment = await this.enrolmentRepository.update(id, {
      deleted_at: new Date(),
    });

    if (updatedEnrolment.affected <= 0) {
      throw new InternalServerErrorException('Enrolment not deleted');
    }

    return { id };
  }
}
