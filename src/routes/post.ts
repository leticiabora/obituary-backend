import express from 'express';
import { createPost, getPost, getPosts } from '@controllers/post';
import isAuth from '@middlewares/is-auth';
import { createPostValidation } from '@validations/post';
import { createComment } from '@controllers/comment';

const router = express.Router();

router.get('/posts', getPosts);

router.get('/post/:id', getPost);

router.post('/post', isAuth, createPostValidation, createPost);

router.post('/comment', isAuth, createComment);

export default router;