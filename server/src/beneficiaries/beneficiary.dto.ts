import {BasicDTO} from "../queries/dtos/basic.dto";

export class BeneficiaryInDTO extends BasicDTO{

  id:string;
  name?:string;
  country?:string;
  region?:string;
  latitude?:string;
  longitude?:string;
  fund?:string;
  program?:string;
  beneficiaryType?:string;
  orderEuBudget?:boolean;
  orderTotalBudget?:boolean;
  orderNumProjects?:boolean;
  limit?:number;
  offset?:number;

}

export class BeneficiaryOutDTO{

  id: string;
  label: string;
  euBudget: number;
  budget: number;
  cofinancingRate: number;
  numberProjects: number;
  country: string;
  countryCode: string;
  link: string;
  transliteration: string;

}

export class BeneficiaryOutWrapperDTO {

  list: BeneficiaryOutDTO[];
  numberResults:number;

}

export class BeneficiaryProjectInDTO extends BasicDTO{

  id:string;
  page: number;
  pageSize: number;

}

export class BeneficiaryProjectOutDTO {
  fundLabel: string;
  project: string;
  euBudget: number;
  startTime: Date;
  label: string;
  endTime: Date;
  budget: number;
}

export class BeneficiaryProjectOutWrapperDTO {
  projects:BeneficiaryProjectOutDTO[];
  item:string;
}
