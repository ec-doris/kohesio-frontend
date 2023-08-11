export class User {
  user_id!: string;
  role!: string;
  active!:boolean;
  name?:string;
  organization?:string;
  allowed_cci_qids?:string[];
  email?:string;
  expiration_time?:Date;
}
