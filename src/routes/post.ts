import express from 'express';
import { getPosts } from '@controllers/post';
import isAuth from '@middlewares/is-auth';

const router = express.Router();

router.get('/posts', isAuth, getPosts);

export default router;