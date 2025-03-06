import { RequestHandler } from 'express';
import crypto from 'crypto';
import Post from '@models/Post';
import { validationResult } from 'express-validator';
import { CustomError } from '@customTypes/error.Types';
import { CustomRequest } from '@customTypes/request.Types';
import { ObjectCannedACL, S3 } from '@aws-sdk/client-s3';
import { AWS_ACCESS_KEY, AWS_BUCKET, AWS_REGION, AWS_SECRET_KEY } from '@config/envs';
import { UPLOAD_DIR } from '@config/constants';
import { UploadedFile } from 'express-fileupload';
import sharp from 'sharp';

const s3 = new S3({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

// console.log('S3', s3);

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

    const uuid = crypto.randomUUID();

    const file = req.files?.image as UploadedFile;

    console.log('FILE', file)
    
    const newImageName = `${uuid}${req.user.id}.jpg`;
    const newAvatarKey = `${UPLOAD_DIR}/large/${newImageName}`;  
    
    const largeImage = await sharp(file.data).resize(200, 200).toFormat('jpg', { quality: 90 }).toBuffer();

    const imageUpload = {
      Bucket: AWS_BUCKET,
      Key: newAvatarKey,
      Body: largeImage,
      ContentType: 'image/jpeg',
      ACL: ObjectCannedACL.public_read,
      CacheControl: 'public, max-age=315360000',
    };

    const imageUploaded = await s3.putObject(imageUpload);

    console.log('imageUploaded', imageUploaded);

    const newPost = await Post.create({
      title,
      description,
      userId: req.user.id,
      image: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${newAvatarKey}`,
    });

    res.status(201).json({
      message: 'Post created successfully!',
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};
