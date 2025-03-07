import { CustomRequest } from '@customTypes/request.Types';
import { Comment, User } from '@models';
import { RequestHandler } from 'express';

export const createComment: RequestHandler = async (req: CustomRequest, res, next) => {
  try {
    const userId = req?.user?.id;
    
    const { description, postId } = req.body;
    
    const addComment = await Comment.create({
      postId,
      description,
      userId,
    });
    console.log(addComment);

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
      }
    })

  } catch (error) {
    next(error);
  }
}