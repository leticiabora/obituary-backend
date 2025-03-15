import { CustomError } from '@customTypes/error.Types';
import { CustomRequest } from '@customTypes/request.Types';
import { Comment, User } from '@models';
import { RequestHandler } from 'express';

export const createComment: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req?.user?.id;

    if (!req.user) {
      const error: CustomError = new Error('Not Authenticated!');

      error.status = 401;

      throw error;
    }

    const { description, postId } = req.body;

    const addComment = await Comment.create({
      postId,
      description,
      userId,
    });

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name'],
    });

    const formattedComment = addComment.toJSON();
    delete formattedComment.userId;

    res.status(200).json({
      message: 'Comment created successfully!',
      comment: {
        author: user,
        ...formattedComment,
      },
    });
  } catch (error) {
    next(error);
  }
};
