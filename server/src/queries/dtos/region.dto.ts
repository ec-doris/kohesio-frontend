import {BasicDTO} from "./basic.dto";

export class RegionInDTO extends BasicDTO{

  country?: string;

  qid?: string;

}

export class RegionOutDTO {

  name: string;
  region: string;

}

