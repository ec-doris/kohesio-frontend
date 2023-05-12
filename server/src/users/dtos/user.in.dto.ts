import {Expose} from "class-transformer";

export class UserInDto {

  userid: string;
  role: string;
  active: boolean;

}

export class UserInternalInDto {

  @Expose({name:"userid"})
  user_id: string;
  role: string;
  active: boolean;

}
