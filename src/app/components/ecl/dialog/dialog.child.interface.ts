import {Observable} from "rxjs";

export interface DialogChildInterface{
  getData?():any;

  data?:any;

  beforeSave?():Observable<boolean>;
}
