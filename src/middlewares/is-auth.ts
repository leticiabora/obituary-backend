import { CustomError } from '@customTypes/error.Types';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload | string;
}


const isAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('token', token);
  
    if (!token) {
      const error: CustomError = new Error('Not Authenticated!');
  
      error.status = 401;
  
      throw error;
    }


    const decoded = jwt.verify(token, `${process.env.SECRET}`);

    console.log('decoded', decoded);

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