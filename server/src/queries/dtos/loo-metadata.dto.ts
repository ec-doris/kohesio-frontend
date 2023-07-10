import {BasicDTO} from "./basic.dto";

export class LooMetadataInDTO extends BasicDTO{

  country?: string;

}

export class LooMetadataOutDTO {

  first_ingestion: string;
  country: {
    code: string;
    label: string;
    qid: string;
  };
  instance: string;
  ccis: string[];
  last_update: string;
  instanceLabel: string;
  id: string;
  url: string;

}

