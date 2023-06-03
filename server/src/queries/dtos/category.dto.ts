import {BasicDTO} from "./basic.dto";

export class CategoryInDTO extends BasicDTO{

  qid?: string;

}

class CategoryOptions{
  instance: string;
  instanceLabel: string;
}
export class CategoryOutDTO {

  areaOfInterventionLabel: string;
  areaOfIntervention: string;
  areaOfInterventionId: string;
  options: CategoryOptions[];

}

