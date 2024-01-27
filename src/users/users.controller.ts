import { Body, Controller, Get, HttpCode, Logger, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { UserResponseInterface } from './types/user-response.interface';
import { LoginDto } from './dto/login.dto';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('users/register')
  @UsePipes(new ValidationPipe())
  public async register(@Body('user') registerDto: RegisterDto): Promise<UserResponseInterface> {
    const user = await this.usersService.signup(registerDto);
    return this.usersService.buildUserResponse(user);
  }

  @HttpCode(200)
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  public async login(@Body('user') loginDto: LoginDto): Promise<UserResponseInterface> {
    const user = await this.usersService.signin(loginDto);
    return this.usersService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  public async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.usersService.buildUserResponse(user);
  }
}
