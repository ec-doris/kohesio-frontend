import {Allow} from "class-validator";
import {Exclude, Expose} from "class-transformer";

/**
 * The DTO input is used to get the input from the user and
 * also to input of the service, the names can be different,
 * We can @Exclude fields to not expose to the input of the user
 */
export class DraftInDTO {

  @Allow()
  @Expose({name:"qid"})
  operation_qid: string;
  @Expose({name:"name"})
  edit_name?: string;
  label?: string;
  summary?: string;
  language?: string;
  @Exclude()
  user_id?: string;
  status?:string;

}

/**
 * The DTO output is used to return values to the user and
 * also to map values from the service, the names can be different,
 * We can @Exclude fields to not expose to the final user
 */
export class DraftOutDTO {

  @Expose({name:"edit_id"})
  id: string;
  @Expose({name:"operation_qid"})
  qid: string;
  @Expose({name:"edit_name"})
  name: string;
  label?: string;
  summary?: string;
  language?: string;
  @Exclude()
  user_id?: string;
  @Exclude()
  status?:string;
  creation_time?:string;

}
