import {Expose, Type} from "class-transformer";

export class ListOfOperation{

  @Type(() => Date)
  @Expose({ name: 'first_ingestion' })
  firstIngestion!: Date;
  instance!: string;
  ccis!: [string];
  @Type(() => Date)
  @Expose({ name: 'last_update' })
  lastUpdate!: Date;
  instanceLabel!: string;
  id!: string;
  url!: string;

}
