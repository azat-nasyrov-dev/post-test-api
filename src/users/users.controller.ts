import { Body, Controller, HttpCode, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { UserResponseInterface } from './types/user-response.interface';
import { LoginDto } from './dto/login.dto';

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
}
