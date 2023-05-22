import {Exclude, Expose} from "class-transformer";
import {Role} from "./user.in.dto";

export class UserDTO{
  @Expose({name:"user_id"})
  user_id: string;

  @Expose()
  role: Role;
  @Expose()
  active: boolean;

}
