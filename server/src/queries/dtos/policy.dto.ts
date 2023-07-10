import {BasicDTO} from "./basic.dto";

export class PolicyInDTO extends BasicDTO{

  theme?: string;

  qid?: string;

}

class ThemePolicy{
  instance: string;
  id: string;
}

export class PolicyOutDTO {

  instance: string;
  theme: ThemePolicy[];
  instanceLabel: string;
  id: string;

}
