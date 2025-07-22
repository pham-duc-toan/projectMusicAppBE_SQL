import { IRole } from 'src/roles/role.inerface';
import { ISinger } from 'src/singers/singer.interface';

export interface IUser {
  id: string;
  fullName: string;
  username: string;
  role: IRole;
  singerId?: ISinger;
}
