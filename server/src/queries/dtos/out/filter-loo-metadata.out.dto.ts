export class FilterLooMetadataOutDto {

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
