import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity'; // Asegúrate de que esta ruta sea correcta
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class Auth0Service {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createAuth0User(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (userExists) {
      throw new ConflictException('Username or email already exists');
    }

    const { password, ...user } = createUserDto;
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...user,
      password: encryptedPassword,
    });

    return await this.userRepository.save(newUser);
  }
}
