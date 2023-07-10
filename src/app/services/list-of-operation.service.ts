import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance} from 'class-transformer';
import { environment } from 'src/environments/environment';
import {ListOfOperation} from "../models/loo.model";

@Injectable({
  providedIn: 'root'
})
export class ListOfOperationService {

  private readonly url:string = '/queries/loo_metadata';

  constructor(private http: HttpClient,@Inject(LOCALE_ID) public locale: string) {
    this.url = environment.api + this.url;
  }

  getListOfOperation(params:any = {}): Observable<ListOfOperation[]>  {
    if (!params || !params.language) {
      params.language = this.locale;
    }
    return this.http.get<any>(this.url,{ params: <any>params }).pipe(
      map((data:[]) => {
        const results:ListOfOperation[] = plainToInstance(ListOfOperation, data);
        return results;
      })
    );
  }

}
