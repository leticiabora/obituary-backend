import dotenv from 'dotenv';

dotenv.config();

import express, { Express, Request, Response } from 'express';
import sequelize from '@config/database';

const app: Express = express();
const port = process.env.PORT || 4000;

const startDatabase = async () => await sequelize.sync();

startDatabase();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log('Server is running!');
});
