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

  public queryParams = {
    "keywords": $localize`:@@translate.queryParams.keywords:keywords`,
    "country": $localize`:@@translate.queryParams.country:country`,
    "region": $localize`:@@translate.queryParams.region:region`,
    "policyObjective": $localize`:@@translate.queryParams.policyObjective:policyObjective`,
    "theme": $localize`:@@translate.queryParams.theme:theme`,
    "fund": $localize`:@@translate.queryParams.fund:fund`,
    "interreg": $localize`:@@translate.queryParams.interreg:interreg`,
    "programme": $localize`:@@translate.queryParams.programme:programme`,
    "totalProjectBudget": $localize`:@@translate.queryParams.totalProjectBudget:totalProjectBudget`,
    "amountEUSupport": $localize`:@@translate.queryParams.amountEUSupport:amountEUSupport`,
    "interventionField": $localize`:@@translate.queryParams.interventionField:interventionField`,
    "nuts3": $localize`:@@translate.queryParams.nuts3:nuts3`,
    "projectStart": $localize`:@@translate.queryParams.projectStart:projectStart`,
    "projectEnd": $localize`:@@translate.queryParams.projectEnd:projectEnd`,
    "sort": $localize`:@@translate.queryParams.sort:sort`,
    "name": $localize`:@@translate.queryParams.name:name`,
    "beneficiaryType": $localize`:@@translate.queryParams.beneficiaryType:beneficiaryType`,
    "page": $localize`:@@translate.queryParams.page:page`,
    "tab": $localize`:@@translate.queryParams.tab:tab`
  }

  public projectPage = {
    tabs: {
      results: $localize`:@@translate.projectPage.tabs.results:results`,
      audiovisual: $localize`:@@translate.projectPage.tabs.audiovisual:audiovisual`,
      map: $localize`:@@translate.projectPage.tabs.map:map`,
    }
  }

  constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) {}

}
