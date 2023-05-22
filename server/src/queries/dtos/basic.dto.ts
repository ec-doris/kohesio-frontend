import {ApiProperty} from "@nestjs/swagger";

export class BasicDTO {

  @ApiProperty({
    default: 'en'
  })
  language?:string;

}
