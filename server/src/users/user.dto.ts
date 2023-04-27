import {Expose} from "class-transformer";

export class UserDTO{

  @Expose()
  uid: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

}
