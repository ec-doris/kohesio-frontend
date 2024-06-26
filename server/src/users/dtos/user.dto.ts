import { Expose } from 'class-transformer';
import { Role } from './user.in.dto';

export class UserDTO {
  @Expose({ name: 'user_id' })
  user_id: string;
  @Expose()
  role: Role;
  @Expose()
  active: boolean;
  @Expose()
  allowed_cci_qids: string[];
  @Expose()
  name: string;
  @Expose()
  organization: string;
  @Expose()
  email: string | string[];
  @Expose()
  expiration_time: Date;
  @Expose()
  notifications_count: number;

}
