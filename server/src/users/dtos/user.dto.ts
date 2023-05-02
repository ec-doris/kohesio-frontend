import {Exclude, Expose} from "class-transformer";

export class UserDTO{

  user_id: string;

  role: string;

  @Exclude()
  active: boolean;

}
