import {Expose, Type} from "class-transformer";

export class Draft {

  id!: number;
  qid!: string;
  name?:string;
  label!:string;
  summary!:string;
  language!: string;
  userid!: string;
  status!: string;

  @Type(() => Date)
  @Expose({name:"creation_time"})
  creationTime!: Date;

}
