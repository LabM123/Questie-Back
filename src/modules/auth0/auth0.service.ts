import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity'; // Asegúrate de que esta ruta sea correcta
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Auth0Service {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /*   private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.role,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  } */

  async createAuth0User(createUserDto: CreateUserDto): Promise<User | any> {
    const userExists = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
      withDeleted: true,
    });

    if (userExists) {
      const validPassword = await bcrypt.compare(
        createUserDto.password,
        userExists.password,
      );
      if (!validPassword)
        throw new BadRequestException('Wrong email or password');

      const payload = {
        id: userExists.id,
        email: userExists.email,
        isAdmin: userExists.role,
        sub: userExists.id,
      };

      const token = this.jwtService.sign(payload, {
        algorithm: 'HS256'
      });

      return { token, userExists, message: 'Login successful' };
    }
    
    try {
      const encryptedPassword = await bcrypt.hash(userExists.password, 10);
      if (!encryptedPassword)
        throw new InternalServerErrorException(
          'Password could not be encrypted',
        );

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: encryptedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
