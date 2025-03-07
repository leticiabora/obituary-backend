import express from 'express';
import { createPost, getPost, getPosts } from '@controllers/post';
import isAuth from '@middlewares/is-auth';
import { createPostValidation } from '@validations/post';

const router = express.Router();

router.get('/posts', isAuth, getPosts);

router.get('/post/:id', getPost);

router.post('/post', isAuth, createPostValidation, createPost);

export default router;