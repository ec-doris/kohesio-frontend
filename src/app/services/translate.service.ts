import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  public routes = {
    projects: $localize`:@@translate.routes.projects:projects`,
    beneficiaries: $localize`:@@translate.routes.beneficiaries:beneficiaries`,
    search: $localize`:@@translate.routes.search:search`,
    about:  $localize`:@@translate.routes.about:about`,
    privacy: $localize`:@@translate.routes.privacy:privacy`,
    services: $localize`:@@translate.routes.services:services`,
    themes: $localize`:@@translate.routes.themes:themes`,
    faq: $localize`:@@translate.routes.faq:faq`,
    map: $localize`:@@translate.routes.map:map`
  }

  constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) {}

}
