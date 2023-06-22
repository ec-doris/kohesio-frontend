import {Expose} from "class-transformer";

export class UserInDto {

  userid: string;
  name:string;
  organization:string;
  role: Role;
  active: boolean;
  allowed_cci_qids: string[];
  email:string;

}

export class UserInternalInDto {

  @Expose({name:"userid"})
  user_id: string;
  role: Role;
  active: boolean;
  allowed_cci_qids: string[];

}

export enum Role {

  EDITOR = "EDITOR",
  REVIEWER = "REVIEWER",
  ADMIN = "ADMIN",
  USER = "USER",

}
