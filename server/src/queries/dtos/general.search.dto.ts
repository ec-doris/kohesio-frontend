import {BasicDTO} from "./basic.dto";

export class GeneralSearchInDTO extends BasicDTO{

  keywords:string;
  limit:number;
  offset:number;

}

export class GeneralSearchOutDTO {

      item: string;
      label: string;
      country: string;
      countryLabel: string;
      countryCode: string;
      link: string;
      transliteration: string;
      type: string;
      typeLabel: string;
      summary: string;
      image: string;
      imageCopyright: string;
      imageSummary: string;

}

export class GeneralSearchWrapperOutDTO{

  list:GeneralSearchOutDTO[];
  numberResults:number;

}
