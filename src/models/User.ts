import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@config/database';
import { IUser } from '@customTypes/user.Types';

type IUserCreation = Optional<IUser, 'id' | 'active' | 'alive'>;

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
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      // allowNull: false,
    },
    alive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      // allowNull: false,
    },
  },
  {
    // defaultScope: {
    //   attributes: { exclude: ['password'] },
    // },
    timestamps: true,
  },
);

export default User;
