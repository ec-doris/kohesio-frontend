import {Exclude, Expose} from "class-transformer";

export class DraftDto {

  user_id: string;

  role: string;

  active: boolean;

}
