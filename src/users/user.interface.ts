import { IRole } from 'src/roles/role.inerface';

export interface IUser {
  id: string;
  fullName: string;
  username: string;
  role: IRole;
  singerId?: string;
}
