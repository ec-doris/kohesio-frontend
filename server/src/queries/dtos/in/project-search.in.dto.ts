import {BasicFilterInDto} from "./basic-filter.in.dto";

export class ProjectSearchInDto extends BasicFilterInDto{

  keywords?:string;
  country?:string;
  theme?:string;
  fund?:string;
  program?:string;
  categoryOfIntervention?:string;
  policyObjective?:string;
  budgetBiggerThan?:number;
  budgetSmallerThan?:number;
  budgetEUBiggerThan?:number;
  budgetEUSmallerThan?:number;
  startDateBefore?:number;
  startDateAfter?:number;
  endDateBefore?:number;
  endDateAfter?:number;
  orderStartDate?:boolean;
  orderEndDate?:boolean;
  orderEuBudget?:boolean;
  orderTotalBudget?:boolean;
  latitude?:string;
  longitude?:string;
  region?:string;
  limit?:number;
  offset?:number;
  town?:string;
  radius?:string;
  nuts3?:string;
  interreg?:boolean;
  highlighted?:boolean;
  cci?:string;
  timeout?:number;

}
