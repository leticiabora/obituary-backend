import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

dotenv.config();

import express, { Express, NextFunction, Request, Response } from 'express';
import { startDatabase } from '@config/database';

import authRoutes from '@routes/auth';
import postRoutes from '@routes/post';
interface CustomError extends Error {
  status?: number;
}

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(fileUpload());

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/', postRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = err.status ?? 500;

  if (!statusCode) {
    res.status(500).send(err);
  }
  res.status(statusCode).json({ error: err.message });
});


app.listen(port, async () => {
  await startDatabase();
  console.log('Server is running!');
});
