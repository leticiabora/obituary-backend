import { body } from 'express-validator';

export const createPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be 2 to 150 characters.'),

  body('description')
    .trim()
    .isLength({ max: 2048 })
    .withMessage('Description must be at most 2048 characters long.'),
];

export const createCommentValidation = [
  body('description').trim().isLength({ max: 2048 }).withMessage('Description must be at most 2048 characters long.'),
]