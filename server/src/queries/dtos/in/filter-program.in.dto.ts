import {BasicFilterInDto} from "./basic-filter.in.dto";

export class FilterProgramInDto extends BasicFilterInDto{

  country?: string;
  region?: string;
  fund?: string;
  qid?: string;
  interreg?: boolean;

}
