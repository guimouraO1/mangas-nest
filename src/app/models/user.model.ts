export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  role: Role;
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}
