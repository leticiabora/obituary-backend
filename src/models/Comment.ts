import { DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';
import Post from './Post';

const Comment = sequelize.define(
  'comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  },
);

export default Comment;
