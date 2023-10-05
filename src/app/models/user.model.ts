import {Type} from "class-transformer";

export class User {
  user_id!: string;
  role!: string;
  active!:boolean;
  name?:string;
  organization?:string;
  allowed_cci_qids?:string[];
  email?:string;
  @Type(() => Date)
  expiration_time?:Date;
  @Type(() => Date)
  creation_time?:Date;
  @Type(() => Date)
  last_login_time?:Date;
  impersonateUser?:boolean;
  notifications_count?:number;
}
