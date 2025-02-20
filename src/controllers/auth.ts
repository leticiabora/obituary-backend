import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '@models/User';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | any> => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ message: 'Email, Name, and Password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hasUser = await User.findOne({ where: { email } });

    console.log(hasUser);

    if (hasUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const newUser = await User.create(
      {
        email,
        name,
        password: hashedPassword,
      },
    );

    return res.status(201).json({
      message: 'User created successfully!',
      user: {
        email: newUser.get('email'),
        name: newUser.get('name'),
      },
    });

  } catch (error) {
    next(error);
  }
};
