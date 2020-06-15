import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

    constructor(private http: HttpClient) { }

}
