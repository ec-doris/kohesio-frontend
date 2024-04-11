import {BasicDTO} from "../queries/dtos/basic.dto";

export class MapSearchInDTO extends BasicDTO{

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
  latitude?:string;
  longitude?:string;
  region?:string;
  granularityRegion?:string;
  limit?:number;
  offset?:number;
  radius?:string;
  nuts3?:string;
  interreg?:boolean;
  highlighted?:boolean;
  ccis?: string;
  timeout?:number;

}

export class MapSearchPointInDTO extends MapSearchInDTO{

  coordinate: string;

}

class UpperRegions {
  regionLabel: string;
  region: string;
}

class SubRegions {
  geoJson: string;
  count: number;
  regionLabel: string;
  region:string;
}

class ProjectList{
  coordinates:string;
  isHighlighted:boolean;
}
export class MapSearchOutDTO{

  geoJson: string;
  region:string;
  regionLabel: string;
  upperRegions?: UpperRegions[];
  subregions?: SubRegions[];
  list?:ProjectList[]

}

export class MapSearchPointOutDTO{

  isHighlighted: boolean;
  item: string;
  label: string;

}

export class MapSearchNearbyOutDTO{
  geoJson: string;
  upperRegions?: UpperRegions[];
  coordinates: string;
  regionLabel: string;
  list:ProjectList[]
}
