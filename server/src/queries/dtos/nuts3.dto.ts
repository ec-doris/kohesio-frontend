import {BasicDTO} from "./basic.dto";

export class Nuts3InDTO extends BasicDTO{

  country?: string;
  region?: string;
  qid?: string;

}

export class Nuts3OutDTO {

  country: string;
  instance: string;
  name: string;
  nuts_code: string;

}
