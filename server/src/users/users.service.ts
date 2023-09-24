import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcryptjs'
import { RoleEnum } from 'src/constants/enums';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User)
  private userRepository: Repository<User>, private readonly jwtService: JwtService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService) {

  }

  async create(createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt)
    const user = this.userRepository.create({ ...createUserDto, password: hashedPassword,role: RoleEnum.USER });
    return await this.userRepository.save(user)
  }

  async login(email: string, password: string) {
    const payload = await this.authService.loginUsingEmail(email, password)
    if (payload) {
      return {
        access_token: this.jwtService.sign(payload, { privateKey: process.env.JWT_KEY }),
      };
    }
    throw new UnauthorizedException();
  }

  findAll() {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }


  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) return user
    return { message: 'User not found' }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
