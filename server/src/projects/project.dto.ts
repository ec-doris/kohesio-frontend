import {BasicDTO} from "../queries/dtos/basic.dto";

export class ProjectSearchInDto extends BasicDTO{

  keywords?:string;
  country?:string;
  theme?:string;
  fund?:string;
  program?:string;
  categoryOfIntervention?:string[];
  policyObjective?:string;
  budgetBiggerThan?:number;
  budgetSmallerThan?:number;
  budgetEUBiggerThan?:number;
  budgetEUSmallerThan?:number;
  startDateBefore?: Date;
  startDateAfter?: Date;
  endDateBefore?: Date;
  endDateAfter?: Date;
  orderStartDate?: Date;
  orderEndDate?: Date;
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
  projectTypes?:string;

}

export class ProjectInDto extends BasicDTO{

  id: string;

}

class ProjectProgram{
  programInfoRegioUrl: string;
  programmingPeriodLabel: string;
  programWebsite: string[];
  link: string;
  programFullLabel: string;
  programLabel: string
}

class ProjectFund{
  website: string;
  fullLabel: string;
  id: string;
  label: string;
}

class ProjectBeneficiary{
  website: string;
  link: string;
  beneficiaryLabel: string;
  wikidata: string;
}

class ProjectImage{
  image: string;
  imageCopyright: string;
}

export class ProjectOutDto {

  countryLabel: string[];
  projectWebsite: string;
  link: string;
  description: string;
  themeLabels: string[];
  videos: string[];
  regionUpper2: string;
  cofinancingRate: number;
  program: ProjectProgram[];
  regionUpper3: string;
  tweets: string[];
  regionUpper1: string;
  categoryIDs: string[];
  countryCode: string[];
  startTime: Date;
  euBudget: string;
  funds: ProjectFund[];
  regionText: string;
  policyLabels: string[];
  beneficiaries: ProjectBeneficiary[];
  budget: string;
  item: string;
  images: ProjectImage[];
  geoJson: string[];
  infoRegioUrl: string;
  coordinates: string[];
  fundWebsite: string;
  policyIds: string[];
  label: string;
  managingAuthorityLabel: string;
  fundLabel: string;
  categoryLabels: string[];
  themeIds: string[];
  endTime: Date;
  region: string;
  keepUrl: string;
  hasSubmitted:boolean;
  canEdit:boolean;
  canApprove:boolean;

}

export class ProjectSearchWrapperOutDto{

  list:ProjectSearchOutDto[];
  numberResults: number;
  similarWords?:string[];
}

export class ProjectSearchOutDto {

  link: string;
  item: string;
  snippet: string[];
  labels: string[];
  descriptions: string[];
  startTimes: Date[];
  endTimes: Date[];
  euBudgets: string[];
  totalBudgets: string[];
  images: string[];
  copyrightImages: string[];
  coordinates: string[];
  objectiveIds: string[];
  countrycode: string[];

}

export class ProjectImageSearchWrapperOutDto{

  list:ProjectImageSearchOutDto[];
  numberResults: number;
}

export class ProjectImageSearchOutDto{
  image: string;
  item: string;
  imageCopyright: string;
  title: string;
}
