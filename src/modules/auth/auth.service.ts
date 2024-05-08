import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>, private readonly jwtService: JwtService){}

  async loginUser({username, password}){
    try {
      if(!username || !password) throw new BadRequestException('Incomplete information');
      const user = await this.usersRepository.findOne({where: {username: username}});
      if(!user) throw new BadRequestException('Wrong email or password');
      const validPassword = await bcrypt.compare(password, user.password);
      if(!validPassword) throw new BadRequestException('Wrong email or password');
      const payload = {id: user.id, email: user.email, isAdmin: user.role, sub: user.id};
      const token = this.jwtService.sign(payload);
      return {token, message: "Login successful"};
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  
  async registerUser(user: CreateUserDto){
    try {
      const foundedUser = await this.usersRepository.findOne({where: {email: user.email}});
      if(foundedUser) throw new BadRequestException('Try another email');
      const hashedPassword = await bcrypt.hash(user.password, 10);
      if(!hashedPassword) throw new BadRequestException('Couldnt hash the password');
      const newUser = await this.usersRepository.save({...user, password: hashedPassword});
      const {password, ...userWithoutPassword} = newUser;
      return userWithoutPassword;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
