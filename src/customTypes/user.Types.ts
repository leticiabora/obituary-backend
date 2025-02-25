import { Optional } from 'sequelize';

export interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  birthdate?: Date;
  active: boolean;
  alive: boolean;
}

export type LoggedUser = Optional<IUser, 'password'>;
