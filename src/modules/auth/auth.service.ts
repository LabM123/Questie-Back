import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { Stats } from '../stats/entities/stats.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async loginUser({ username, password }) {
    try {
      if (!username || !password)
        throw new BadRequestException('Incomplete information');

      const user = await this.usersRepository.findOne({
        where: { username: username },
      });

      if (!user) throw new NotFoundException('Wrong email or password');

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        throw new BadRequestException('Wrong email or password');

      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.role,
        sub: user.id,
      };

      const token = this.jwtService.sign(payload);

      return { token, message: 'Login successful' };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async registerUser(user: RegisterUserDto) {
    try {
      const foundUser = await this.usersRepository.findOne({
        where: { email: user.email },
        withDeleted: true,
      });

      if (user.password !== user.confirmPassword)
        throw new BadRequestException('Both passwords must be the same.');

      const hashedPassword = await bcrypt.hash(user.password, 10);
      if (!hashedPassword)
        throw new InternalServerErrorException(
          'Password could not be encrypted',
        );

      if (foundUser) {
        if (foundUser.deleted_at) {
          foundUser.deleted_at = null;
          this.usersRepository.save({
            ...user,
            password: hashedPassword,
            ...foundUser,
          });
          return foundUser;
        }
        throw new ConflictException('Try another email');
      }

      const newUser = await this.usersRepository.save({
        ...user,
        password: hashedPassword,
      });

      await this.statsRepository.save(
        this.statsRepository.create({ user: newUser }),
      );

      await this.mailService.sendMail(
        user.email,
        'Register Successful',
        'Welcome to Questie',
      );

      return newUser;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
