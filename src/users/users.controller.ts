import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { UserResponseInterface } from './types/user-response.interface';
import { LoginDto } from './dto/login.dto';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { INTERNAL_SERVER_ERROR } from './users.constants';

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('users/register')
  @UsePipes(new ValidationPipe())
  public async register(@Body('user') registerDto: RegisterDto): Promise<UserResponseInterface> {
    try {
      const user = await this.usersService.signup(registerDto);
      return this.usersService.buildUserResponse(user);
    } catch (err) {
      this.logger.error(`Error during user registration: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @HttpCode(200)
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  public async login(@Body('user') loginDto: LoginDto): Promise<UserResponseInterface> {
    try {
      const user = await this.usersService.signin(loginDto);
      return this.usersService.buildUserResponse(user);
    } catch (err) {
      this.logger.error(`Error during user login: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user')
  @UseGuards(AuthGuard)
  public async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    try {
      return this.usersService.buildUserResponse(user);
    } catch (err) {
      this.logger.error(`Error fetching current user: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('user')
  @UseGuards(AuthGuard)
  public async updateCurrentUser(
    @User('id') currentUserId: string,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    try {
      const user = await this.usersService.updateUser(currentUserId, updateUserDto);
      return this.usersService.buildUserResponse(user);
    } catch (err) {
      this.logger.error(`Error updating current user: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
