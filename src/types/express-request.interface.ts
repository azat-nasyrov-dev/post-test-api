import { Request } from 'express';
import { UserEntity } from '../users/entities/user.entity';

export interface ExpressRequestInterface extends Request {
  user?: UserEntity;
}
