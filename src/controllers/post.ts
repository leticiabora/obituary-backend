import { RequestHandler } from 'express';
import Post from '@models/Post';
import { validationResult } from 'express-validator';
import { CustomError } from '@customTypes/error.Types';
import { CustomRequest } from '@customTypes/request.Types';

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.findAll();

    res.status(200).json({
      message: 'Posts fetch sucessfully!',
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors });

    return;
  }

  try {
    const { title, description } = req.body;

    if (!req.user) {
      const error: CustomError = new Error('Not Authenticated!');

      error.status = 401;

      throw error;
    }

    const newPost = await Post.create({
      title,
      description,
      userId: req.user.id,
    });

    console.log('newPost', newPost);

    res.status(201).json({
      message: 'Post created successfully!',
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};
