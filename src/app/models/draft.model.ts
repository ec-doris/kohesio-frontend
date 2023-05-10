import {Type} from "class-transformer";

export class Draft {

  id!: number;

  qid!: string;

  label!:string;
  summary!:string;
  language!: string;
  userid!: string;
  status!: string;

  @Type(() => Date)
  creationTime!: Date;

}
