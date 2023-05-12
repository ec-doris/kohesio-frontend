import {Exclude, Expose} from "class-transformer";

export class UserDTO{
  @Expose({name:"user_id"})
  user_id: string;

  @Expose()
  role: string;
  @Expose()
  active: boolean;

}
