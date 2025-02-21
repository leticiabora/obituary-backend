import { Router } from 'express';
import { login, signUp } from '@controllers/auth';
import { signUpValidation } from 'src/validations';

const router = Router();

router.post('/signup', signUpValidation, signUp);

router.post('/login', login);

export default router;
