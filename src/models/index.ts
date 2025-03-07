import { sequelize } from '@config/database';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Like from './Like';

User.hasMany(Post, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
User.hasMany(Like, { foreignKey: 'userId' });

Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Post.hasMany(Like, { foreignKey: 'postId' }); 
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.hasMany(Like, { foreignKey: 'commentId' });

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });

export { User, Post, Comment, Like, sequelize };