export interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  birthdate?: Date;
  active: boolean;
  alive: boolean;
}