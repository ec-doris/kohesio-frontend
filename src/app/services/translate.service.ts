import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {FilterService} from "./filter.service";
import {ActivatedRoute, ParamMap, Router, UrlSegment} from "@angular/router";
import {Observable, Observer} from "rxjs";

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

  public sections = {
    myregion: $localize`:@@translate.sections.myregion:my-region`,
    themes: $localize`:@@translate.sections.themes:themes`,
    section: $localize`:@@translate.sections.section:section`
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

  public translations: any = {};

  constructor(private http: HttpClient,
              @Inject(LOCALE_ID) public locale: string,
              private filterService: FilterService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {}

  public translateUrl(localeTo: string): Observable<string>{
    return new Observable((observer: Observer<string>) => {
      const queryParams: ParamMap = this.activatedRoute.snapshot.queryParamMap;
      let segments:UrlSegment[] = [];
      if (this.router.parseUrl(this.router.url).root.hasChildren()){
        segments = this.router.parseUrl(this.router.url).root.children['primary'].segments;
        this.getLocaleFile(localeTo).subscribe(data => {
          this.translations = data.translations;
          const resultSegments = this.buildSegments(segments);
          observer.next(`/${localeTo}`+resultSegments);
        });
      }else{
        observer.next(`/${localeTo}`);
      }
    });
  }

  private buildSegments(segments:UrlSegment[]){
    let result:string = "";
    segments.forEach((segment:UrlSegment)=>{
      const keySegment = this.getRouteKeyFromLabel(segment.path.replace("/",""));
      if (keySegment){
        result += "/" + this.getTranslatedLabel("translate.routes.",keySegment);
      }else{
        result += "/" + segment.path
      }
    });
    return result;
  }

  private getRouteKeyFromLabel(label:string): string | undefined{
    for (let key of Object.keys(this.routes)) {
      const value:string = this.routes[key as keyof typeof this.routes];
      if (value == label){
        return key;
      }
    }
    return undefined;
  }

  private getTranslatedLabel(preKey:string, keySegment:string):string | undefined{
    const msgKey = preKey+keySegment;
    for (let key of Object.keys(this.translations)) {
      if (key == msgKey){
        return this.translations[key];
      }
    }
    return undefined;
  }

  public getLocaleFile(localeTo: string): Observable<any> {
    if (localeTo != 'en') {
      return this.http.get("assets/locale/messages." + localeTo + ".json");
    }else{
      return this.http.get("assets/locale/messages.json");
    }
  }



}
