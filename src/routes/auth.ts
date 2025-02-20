import { Router } from 'express';
import { signUp } from '@controllers/auth';
import { signUpValidation } from 'src/validations';

const router = Router();

router.post('/signup', signUpValidation, signUp);

export default router;
