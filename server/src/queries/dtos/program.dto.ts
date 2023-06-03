import {BasicDTO} from "./basic.dto";

export class ProgramInDTO extends BasicDTO{

  country?: string;
  region?: string;
  fund?: string;
  qid?: string;
  interreg?: boolean;

}

export class ProgramOutDTO {

  instance: string;
  funds: string[];
  instanceLabel: string;

}
