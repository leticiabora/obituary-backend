import { CustomError } from '@customTypes/error.Types';
import { CustomRequest } from '@customTypes/request.Types';
import { IUser } from '@customTypes/user.Types';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';


const isAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      const error: CustomError = new Error('Not Authenticated!');
  
      error.status = 401;
  
      throw error;
    }

    const decoded = jwt.verify(token, `${process.env.SECRET}`) as IUser;

    if (!decoded) {
      const error: CustomError = new Error('Not Authenticated!');
  
      error.status = 401;
  
      throw error;
    }

    req.user = decoded;

    next();
    
  } catch (error) {
    next(error);
  }

}

export default isAuth;