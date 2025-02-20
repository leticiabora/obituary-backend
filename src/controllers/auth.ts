import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
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

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const sanitizedErrors = errors.array().map((error) => {
          return {
            message: error.msg
          };
        });
    
      res.status(400).json({ errors: sanitizedErrors });

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
        email: newUser.get('email'),
        name: newUser.get('name'),
      },
    });
  } catch (error) {
    console.log('error', error)
    next(error);
  }
};
