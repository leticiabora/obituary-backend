import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/database';

interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  // birthdate?: Date;
  // active: boolean;
  // alive: boolean;
}

type IUserCreation = Optional<IUser, 'id'>;

const User = sequelize.define<Model<IUser, IUserCreation>>(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // birthdate: {
    //   type: DataTypes.DATE,
    // },
    // active: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    //   // allowNull: false,
    // },
    // alive: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    //   // allowNull: false,
    // },
  },
  {
    timestamps: true,
  },
);

export default User;
