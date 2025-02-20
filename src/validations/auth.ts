import { body } from 'express-validator';

export const signUpValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format.')
    .normalizeEmail()
    .isLength({ min: 5 })
    .withMessage('Email must be at least 5 characters long.'),

  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];
