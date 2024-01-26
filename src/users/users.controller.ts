import { Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/user-response.interface';

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('users/register')
  @UsePipes(new ValidationPipe())
  public async register(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.usersService.signup(createUserDto);
    return this.usersService.buildUserResponse(user);
  }
}
