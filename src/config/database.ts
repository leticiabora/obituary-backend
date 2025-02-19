import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
  {
    dialect: 'mysql',
  }
);

const startDatabase = async () => {
  try {
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log('Database created!');

    const sequelizeDB = new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
      }
    )
    
    await sequelizeDB.authenticate();
    console.log('Connected to the database successfully!');
    
  } catch (error) {
    console.error('Database creation error:', error);
  }
};

startDatabase();

export default sequelize;
