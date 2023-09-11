import {Type} from "class-transformer";

export class NotificationInDTO{
  seen?:boolean;
}
export class NotificationOutDTO{
  notification_id: number;
  edit_id: number;
  edit_version_id: number;
  notification_type: NotificationType;
  generating_user_id: string;
  @Type(() => Date)
  creation_time: Date;
  operation_qid:string;
  @Type(() => Date)
  seen_at: Date;
}

export enum NotificationType {

  EDIT_SUBMITTED = "EDIT_SUBMITTED",
  EDIT_APPROVED = "EDIT_APPROVED",
  EDIT_PUBLISHED = "EDIT_PUBLISHED",
  EDIT_REJECTED = "EDIT_REJECTED"
}
