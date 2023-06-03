import {BasicDTO} from "./basic.dto";

export class OutermostRegionsInDTO extends BasicDTO{

  qid?: string;

}

export class OutermostRegionsOutDTO {

  country: string;
  instance: string;
  countryLabel: string;
  instanceLabel: string;

}
