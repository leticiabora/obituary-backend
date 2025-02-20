import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import User from '@models/User';

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      res
        .status(400)
        .json({ message: 'Email, Name, and Password are required.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hasUser = await User.findOne({ where: { email } });

    if (hasUser) {
      res.status(400).json({ message: 'Email already exists.' });
      return;
    }

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User created successfully!',
      user: {
        email: newUser.getDataValue('email'),
        name: newUser.getDataValue('name'),
      },
    });
  } catch (error) {
    next(error);
  }
};
