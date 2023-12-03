import { Injectable, HttpException, HttpStatus, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.exist({ where: [{ email: createUserDto.email }, { username: createUserDto.username}]});

    if (existingUser) {
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Cet utilisateur existe déjà'},HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      id: createUserDto.id,
      role: createUserDto.role,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);
    delete savedUser.password;

    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(payload, secretKey);
  }

  async findAll(authenticatedUser?: User): Promise<UserDto[]> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    const usersWithProjects = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'projects')
      .getMany();

    const usersDto = usersWithProjects.map((user) => {
      const { password, projects, ...userWithoutPassword } = user;
      return userWithoutPassword as UserDto;
    });

    return usersDto;
  }

  async findOne(id: string): Promise<UserDto> {
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
        throw new BadRequestException('Invalid UUID format');
    }

    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const { password, projects, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDto;
}

  
  

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
