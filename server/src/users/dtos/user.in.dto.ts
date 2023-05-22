import {Expose} from "class-transformer";

export class UserInDto {

  userid: string;
  role: Role;
  active: boolean;

}

export class UserInternalInDto {

  @Expose({name:"userid"})
  user_id: string;
  role: Role;
  active: boolean;

}

export enum Role {

  EDITOR = "EDITOR",
  REVIEWER = "REVIEWER",
  ADMIN = "ADMIN",
  USER = "USER",

}
