import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserResponseInterface } from './types/user-response.interface';
import { CREDENTIALS_NOT_VALID_ERROR, EMAIL_OR_USERNAME_TAKEN_ERROR, INTERNAL_SERVER_ERROR } from './users.constants';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async signup(registerDto: RegisterDto): Promise<UserEntity> {
    try {
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
    } catch (err) {
      this.logger.error(`Error during signup: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async signin(loginDto: LoginDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
        select: ['id', 'email', 'username', 'password'],
      });

      if (!user) {
        this.logger.error(`User with email ${loginDto.email} not found`);
        throw new HttpException(CREDENTIALS_NOT_VALID_ERROR, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const isPasswordCorrect: boolean = await compare(loginDto.password, user.password);

      if (!isPasswordCorrect) {
        this.logger.error(`Incorrect password for user with email: ${loginDto.email}`);
        throw new HttpException(CREDENTIALS_NOT_VALID_ERROR, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      delete user.password;

      return user;
    } catch (err) {
      this.logger.error(`Error during signin: ${err.message}`);
    }
  }

  public findUserById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.findUserById(userId);
      Object.assign(user, updateUserDto);

      return await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`Error during updateUser: ${err.message}`);
      throw new HttpException(INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
