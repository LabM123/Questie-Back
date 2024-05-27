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
    const user = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
      withDeleted: true,
    });

    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.role,
        sub: user.id,
      };

      const token = this.jwtService.sign(payload, {
        algorithm: 'HS256',
      });

      return { token, user, message: 'Login successful' };
    }

    try {
      const encryptedPassword = await bcrypt.hash(user.password, 10);
      if (!encryptedPassword)
        throw new InternalServerErrorException(
          'Password could not be encrypted',
        );

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: encryptedPassword,
      });

        if (newUser) {
        const payload = {
          id: newUser.id,
          email: newUser.email,
          isAdmin: newUser.role,
          sub: newUser.id,
        };
  
        const token = this.jwtService.sign(payload, {
          algorithm: 'HS256',
        });

      const user = await this.userRepository.save(newUser);
      return { token, user, message: 'Login successful' };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
