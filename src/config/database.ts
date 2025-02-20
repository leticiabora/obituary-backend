import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const databaseUrl = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
  logging: false,
});

export const startDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`✅ Database "${DB_NAME}" is ready!`);
    await connection.end();

    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};