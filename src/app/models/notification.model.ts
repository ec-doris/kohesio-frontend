import {Type} from "class-transformer";

export class Notification {

  notification_id!: number;
  edit_id!: number;
  edit_version_id!: number;
  notification_type!: string;
  generating_user_id!: string;
  @Type(() => Date)
  creation_time!: Date;
  operation_qid!:string;
  @Type(() => Date)
  seen_at!: Date;

}
