import {Allow} from "class-validator";
import {Exclude, Expose} from "class-transformer";

/**
 * The DTO input is used to get the input from the user and
 * also to input of the service, the names can be different,
 * We can @Exclude fields to not expose to the input of the user
 */
export class EditInDTO {

  @Allow()
  @Expose({name:"qid"})
  operation_qid: string;
  @Expose({name:"name"})
  edit_name?: string;
  label?: string;
  summary?: string;
  language?: string;
  user_id?: string;
  status?:Status;
  @Expose({name:"id"})
  edit_id?:number;

}

/**
 * The DTO output is used to return values to the user and
 * also to map values from the service, the names can be different,
 * We can @Exclude fields to not expose to the final user
 */
export class EditOutDTO {

  @Expose({name:"edit_id"})
  id: number;
  @Expose({name:"operation_qid"})
  qid: string;
  @Expose({name:"edit_name"})
  name: string;
  label?: string;
  summary?: string;
  language: string;
  @Expose({name:"user_id"})
  userid: string;
  status:Status;
  creation_time?:string;

}

export enum Status {

  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVE = "APPROVE",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED"

}
