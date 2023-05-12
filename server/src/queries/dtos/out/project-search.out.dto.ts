export class ProjectSearchWrapperOutDto{

  list:ProjectSearchOutDto[];
  numberResults: number;
  similarWords:string[];
}

export class ProjectSearchOutDto {

  link: string;
  item: string;
  snippet: string[];
  labels: string[];
  descriptions: string[];
  startTimes: string[];
  endTimes: string[];
  euBudgets: string[];
  totalBudgets: string[];
  images: string[];
  copyrightImages: string[];
  coordinates: string[];
  objectiveIds: string[];
  countrycode: string[];

}
