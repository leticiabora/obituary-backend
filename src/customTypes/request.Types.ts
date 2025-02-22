import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './user.Types';

export interface CustomRequest extends Request {
  user?: JwtPayload | IUser | undefined;
}
