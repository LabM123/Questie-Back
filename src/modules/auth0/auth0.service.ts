import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { Stats } from '../stats/entities/stats.entity';

@Injectable()
export class Auth0Service {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAuth0User(createUserDto: CreateUserDto): Promise<User | any> {
    const foundUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
      withDeleted: true,
    });

    if (foundUser) {
      const payload = {
        id: foundUser.id,
        email: foundUser.email,
        isAdmin: foundUser.role,
        sub: foundUser.id,
      };

      const token = this.jwtService.sign(payload, {
        algorithm: 'HS256',
      });

      
      return { token, message: 'Login successful' };
    } else {
      try {
        const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);
        if (!encryptedPassword)
          throw new InternalServerErrorException(
            'Password could not be encrypted',
          );
          
          const newUser = this.userRepository.create({
            ...createUserDto,
            password: encryptedPassword,
          });
          
          const user = await this.userRepository.save(newUser);

          await this.statsRepository.save(
            this.statsRepository.create({ user }),
          );

          const payload = {
          id: user.id,
          email: user.email,
          isAdmin: user.role,
          sub: user.id,
        };
        
        const token = this.jwtService.sign(payload, {
          algorithm: 'HS256',
        });

        const stats = this.statsRepository.create({ user: user });
        await this.statsRepository.save(stats);

        await this.mailService.sendMail(
          user.email,
          'Register Successful',
          'Welcome to Questie',
        );

        return { token, message: 'User creation successful' };
      } catch (error) {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }
}
