import { RequestHandler } from 'express';
import Post from '@models/Post';

export const getPosts: RequestHandler = async (req, res, next) => {

  try {
    const posts = await Post.findAll();

    res.status(200).json({
      message: 'Posts fetch sucessfully!',
      posts
    });

  } catch (error) {
    next(error);
  }
} 