import {BasicDTO} from "./basic.dto";

export class CountryInDto extends BasicDTO{

  qid?: string;

}

export class CountryOutDto {

  instance:string;
  instanceLabel:string;
  instanceImage:string;

}
