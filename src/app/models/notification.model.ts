import {Type} from "class-transformer";

export class Notification {

  notification_id!: number;
  edit_id!: number;
  edit_version_id!: number;
  notification_type!: string;
  generating_user_id!: string;
  generating_user_name!: string;
  @Type(() => Date)
  creation_time!: Date;
  operation_qid!:string;
  projectTitle?:string;
  @Type(() => Date)
  seen_at!: Date;

}
