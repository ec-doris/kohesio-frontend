import {Allow} from "class-validator";
import {Exclude, Expose, Transform, Type} from "class-transformer";

/**
 * The DTO input is used to get the input from the user and
 * also to input of the service, the names can be different,
 * We can @Exclude fields to not expose to the input of the user
 */
export class EditInDTO {

  @Allow()
  @Expose({name:"qid"})
  operation_qid: string;
  version_comment?: string;
  label?: string;
  summary?: string;
  language?: string;
  user_id?: string;
  user_name?: string;
  latest_status?:Status[];
  @Expose({name:"id"})
  edit_id?:number;
  archive?:boolean;

  page:number = 0;
  page_size:number = 0;

}

export class EditVersionInDTO{

  @Allow()
  edit_id: number;
  cci_qid?: string;
  operation_qid?: string;
  edit_version_id?: number;
  user_id?: string;
  version_comment?: string;
  status?: string;
  label?: string;
  summary?: string;
}

/**
 * The DTO output is used to return values to the user and
 * also to map values from the service, the names can be different,
 * We can @Exclude fields to not expose to the final user
 */
export class EditVersionDTO{
  edit_id: number;
  edit_version_id: number;
  @Type(() => Date)
  creation_time: Date;
  user_id: string;
  version_comment: string;
  status: string;
  label?: string;
  summary?: string;
}
export class EditOutDTO {

  @Expose({name:"edit_id"})
  id: number;
  @Expose({name:"operation_qid"})
  qid: string;
  cci_qid?: string;
  language:string;
  updated_time:Date;
  @Type(() => Date)
  creation_time:Date;
  @Type(() => EditVersionDTO)
  edit_versions?: EditVersionDTO[];
  @Type(() => EditVersionDTO)
  edit_version?: EditVersionDTO;
  @Type(() => EditVersionDTO)
  latest_version?: EditVersionDTO;

}

export class EditOutWrapperDTO {
  count:number;
  @Type(() => EditOutDTO)
  data?:EditOutDTO[];
}


export enum Status {

  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVE = "APPROVE",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED"

}
