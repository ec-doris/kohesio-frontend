import {ApiProperty} from "@nestjs/swagger";

export class BasicFilterInDto {

  @ApiProperty({
    default: 'en'
  })
  language?:string;

}
