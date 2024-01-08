import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UnauthorizedException, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.usersService.generateToken(user);

    return { access_token: token };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request) {
    const user = req.user as User & { iat: string };
  
    const { password, iat, ...userWithoutSensitiveInfo } = user;
  
    return userWithoutSensitiveInfo;
  }
  

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const authenticatedUser = req.user as User;
    
    return this.usersService.findAll(authenticatedUser);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const userDto = await this.usersService.findOne(id);
    return userDto;
  }

  @Get(':id/meal-vouchers/:month')
  getUserMealVouchers(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Param('month') month: number,
  ) {
    return this.usersService.getUserMealVouchers(userId, month);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
