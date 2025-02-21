import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '@models';

interface CustomError extends Error {
  status?: number;
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error: CustomError = new Error('User not found.');
      error.status = 401;

      throw error;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.dataValues.password,
    );

    if (!passwordMatch) {
      const error: CustomError = new Error('Wrong email or password');
      error.status = 401;

      throw error;
    }

    const token = jwt.sign(
      {
        id: user.dataValues.id,
        email: user.dataValues.email,
      },
      `${process.env.SECRET}`,
      { expiresIn: '10h' },
    );

    res.status(200).json({
      user: {
        id: user.dataValues.id,
        email: user.dataValues.email,
        token
      }
    })
  } catch (error) {
    next(error);
  }
};

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
          message: error.msg,
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
        email: newUser.dataValues.email,
        name: newUser.dataValues.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
