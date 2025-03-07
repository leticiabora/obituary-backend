import { RequestHandler } from 'express';
import crypto from 'crypto';
import Post from '@models/Post';
import { validationResult } from 'express-validator';
import { CustomError } from '@customTypes/error.Types';
import { CustomRequest } from '@customTypes/request.Types';
import { ObjectCannedACL, S3 } from '@aws-sdk/client-s3';
import {
  AWS_ACCESS_KEY,
  AWS_BUCKET,
  AWS_REGION,
  AWS_SECRET_KEY,
} from '@config/envs';
import { UPLOAD_DIR } from '@config/constants';
import { UploadedFile } from 'express-fileupload';
import sharp from 'sharp';
import { Comment, User } from '@models';

const s3 = new S3({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
    });

    const formattedPosts = posts.map((post) => {
      const formattedPost = post.toJSON();
      delete formattedPost.userId;

      return {
        ...formattedPost,
        user: formattedPost.user,
      };
    });

    res.status(200).json({
      posts: formattedPosts,
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

    const uuid = crypto.randomUUID();

    const file = req.files?.image as UploadedFile;

    const newImageName = `${uuid}${req.user.id}.jpg`;
    const newAvatarKey = `${UPLOAD_DIR}/large/${newImageName}`;

    const largeImage = await sharp(file.data)
      .resize(200, 200)
      .toFormat('jpg', { quality: 90 })
      .toBuffer();

    const imageUpload = {
      Bucket: AWS_BUCKET,
      Key: newAvatarKey,
      Body: largeImage,
      ContentType: 'image/jpeg',
      ACL: ObjectCannedACL.public_read,
      CacheControl: 'public, max-age=315360000',
    };

    await s3.putObject(imageUpload);

    const imageUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${newAvatarKey}`;

    const newPost = await Post.create({
      title,
      description,
      userId: req.user.id,
      image: imageUrl,
    });

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name'],
    });

    const formattedPost = newPost.toJSON();
    delete formattedPost.userId;

    res.status(201).json({
      message: 'Post created successfully!',
      post: {
        ...formattedPost,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPost: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'description'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
    });

    const formattedPost = post?.toJSON();
    delete formattedPost.userId;

    res
      .status(200)
      .json({ message: 'Post fetched successfully!', post: formattedPost });
  } catch (error) {
    next(error);
  }
};
