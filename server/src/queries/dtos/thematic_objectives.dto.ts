import {BasicDTO} from "./basic.dto";

export class ThematicObjectivesInDTO extends BasicDTO{

  policy?: string;

  qid?: string;

}

export class ThematicObjectivesOutDTO {

  id:string;
  instance:string;
  instanceLabel:string;

}
