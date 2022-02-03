import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Filters} from "../shared/models/filters.model";
import {environment} from "../../environments/environment";
import {Theme} from "../shared/models/theme.model";
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

    constructor(private http: HttpClient, private configService: ConfigService) {
    }

    getThemes() {
        const url = this.configService.apiBaseUrl + '/thematic_objectives';
        return this.http.get<any>(url)
    }

}
