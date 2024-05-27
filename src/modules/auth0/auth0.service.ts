import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Auth0Service {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

      return { token, user: foundUser, message: 'Login successful' };
    }

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

      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.role,
        sub: user.id,
      };

      const token = this.jwtService.sign(payload, {
        algorithm: 'HS256',
      });

      return { token, user, message: 'User creation successful' };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
