import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserResponseInterface } from './types/user-response.interface';
import { EMAIL_OR_USERNAME_TAKEN_ERROR } from './users.constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async signup(registerDto: RegisterDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    const userByUsername = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(EMAIL_OR_USERNAME_TAKEN_ERROR, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, registerDto);

    return await this.userRepository.save(newUser);
  }

  public generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      this.configService.get<string>('JWT_SECRET'),
    );
  }

  public buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
