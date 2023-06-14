import {BasicDTO} from "./basic.dto";
import {Exclude} from "class-transformer";

export class PriorityAxisInDTO extends BasicDTO{

  qid?: string;
  country?: string;
  program?: string;

}

class Country{
  code: string;
  label: string;
  qid: string;
}
export class PriorityAxisOutDTO {

  instance: string;
  @Exclude()
  totalCostOfSelectedOperations: string;
  instanceLabel: string;
  @Exclude()
  countries: Country[];
  @Exclude()
  program: string;
  priorityAxisID: string;

}

