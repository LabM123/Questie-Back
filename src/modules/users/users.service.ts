import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Stats } from '../stats/entities/stats.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
      withDeleted: true,
    });

    if (userExists) {
      throw new ConflictException('Username or email already exists');
    }

    const { password, ...user } = createUserDto;
    const encryptedPassword = await bcrypt.hash(password, 10);

    const savedUser = await this.userRepository.save(
      this.userRepository.create({
        password: encryptedPassword,
        ...user,
      }),
    );

    await this.statsRepository.save(
      this.statsRepository.create({ user: savedUser }),
    );

    return await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['stats'],
    });
  }

  async findAll(withDeleted: boolean = true): Promise<User[]> {
    return await this.userRepository.find({ withDeleted });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ id: string }> {
    const userExists = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!userExists) {
      throw new NotFoundException(`User not found`);
    }

    const user = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
      withDeleted: true,
    });

    if (user && user.id !== id) {
      throw new ConflictException('Email already exists');
    }

    const updatedUser = await this.userRepository.update(id, {
      ...updateUserDto,
    });

    if (updatedUser.affected <= 0) {
      throw new InternalServerErrorException(`User not updated`);
    }

    return { id };
  }

  async remove(id: string): Promise<{ id: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const deletedUser = await this.userRepository.update(id, {
      deleted_at: new Date(),
    });

    if (deletedUser.affected <= 0) {
      throw new InternalServerErrorException(`User not deleted`);
    }

    return { id };
  }
}
