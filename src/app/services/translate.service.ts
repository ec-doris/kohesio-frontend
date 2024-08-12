import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {FilterService} from "./filter.service";
import {ActivatedRoute, ParamMap, Router, UrlSegment} from "@angular/router";
import {Observable, Observer, forkJoin, firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

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
    accessibility: $localize`:@@translate.routes.accessibility:accessibility`
  }

  public sections = {
    myregion: $localize`:@@translate.sections.myregion:my-region`,
    themes: $localize`:@@translate.sections.themes:themes`,
    section: $localize`:@@translate.sections.section:section`,
    accessibilityNonContentSection: $localize`:@@translate.sections.accessibilityNonContentSection:accessibilityNonContentSection`
  }

  public queryParams:any = {
    "keywords": $localize`:@@translate.queryParams.keywords:keywords`,
    "country": $localize`:@@translate.queryParams.country:country`,
    "region": $localize`:@@translate.queryParams.region:region`,
    "town": $localize`:@@translate.queryParams.town:town`,
    "policyObjective": $localize`:@@translate.queryParams.policyObjective:policyObjective`,
    "theme": $localize`:@@translate.queryParams.theme:theme`,
    "fund": $localize`:@@translate.queryParams.fund:fund`,
    "interreg": $localize`:@@translate.queryParams.interreg:interreg`,
    "programme": $localize`:@@translate.queryParams.programme:programme`,
    "totalProjectBudget": $localize`:@@translate.queryParams.totalProjectBudget:totalProjectBudget`,
    "amountEUSupport": $localize`:@@translate.queryParams.amountEUSupport:amountEUSupport`,
    "interventionField": $localize`:@@translate.queryParams.interventionField:interventionField`,
    "nuts3": $localize`:@@translate.queryParams.nuts3:nuts3`,
    "priorityAxis": $localize`:@@translate.queryParams.priorityAxis:priorityAxis`,
    "projectCollection": $localize`:@@page.projects.label.projectCollection:projectCollection`,
    "projectStart": $localize`:@@translate.queryParams.projectStart:projectStart`,
    "projectEnd": $localize`:@@translate.queryParams.projectEnd:projectEnd`,
    "sdg": $localize`:@@translate.queryParams.sdg:sdg`,
    "sort": $localize`:@@translate.queryParams.sort:sort`,
    "name": $localize`:@@translate.queryParams.name:name`,
    "beneficiaryType": $localize`:@@translate.queryParams.beneficiaryType:beneficiaryType`,
    "page": $localize`:@@translate.queryParams.page:page`,
    "tab": $localize`:@@translate.queryParams.tab:tab`,
    "mapRegion": $localize`:@@translate.queryParams.mapRegion:mapRegion`
  }

  public dynamicMetadata = {
    projects: {
      "titleAlt0": $localize `:@@page.metadata.projects-alt-0:Projects co-funded by the EU`,
      "titleAlt1": $localize `:@@page.metadata.projects-alt-1:EU projects`,
      "titleAlt2": $localize `:@@page.metadata.projects-alt-2:EU projects in`,
      "titleAlt3": $localize `:@@page.metadata.projects-alt-3:EU projects on`
    },
    projectDetail: {
      "description": $localize `:@@page.metadata.project-detail.description:Project co-funded by the EU`,
    }
  }

  public projectPage = {
    tabs: {
      results: $localize`:@@translate.projectPage.tabs.results:results`,
      audiovisual: $localize`:@@translate.projectPage.tabs.audiovisual:audiovisual`,
      map: $localize`:@@translate.projectPage.tabs.map:map`,
    }
  }

  public queryParamToFilter:any = {
    "country": "countries",
    "region": "regions",
    "theme": "thematic_objectives",
    "policyObjective": "policy_objectives",
    "fund":"funds",
    "categoryOfIntervention":"categoriesOfIntervention",
    "nuts3":"nuts3"
  }

  public translationsStaticFiltersKey:any = {
    "sortProjects": {
      "orderStartDate-true":"orderStartDateAsc",
      "orderStartDate-false": "orderStartDateDesc",
      "orderEndDate-true": "orderEndDateAsc",
      "orderEndDate-false": "orderEndDateDesc",
      "orderTotalBudget-true": "orderTotalBudgetAsc",
      "orderTotalBudget-false": "orderTotalBudgetDesc"
    },
    "sortBeneficiaries":{
      "orderNumProjects-true":"numProjectsAsc",
      "orderNumProjects-false":"numProjectsDesc",
      "orderEuBudget-true":"euContributionAsc",
      "orderEuBudget-false":"euContributionDesc",
      "orderTotalBudget-true":"totalBudgetAsc"
    },
    "beneficiaryType":{
      "public":"public",
      "private":"private"
    },
    "interreg":{
      "true":"interreg",
      "false":"investGrowthJobs"
    }
  }

  public userManagement = {
    messages:{
      "invitedUser": $localize `:@@page.users.message.invited:The user was invited`,
      "updatedUser": $localize `:@@page.users.message.updated:The user was updated with success`,
      "confirmDelete": $localize `:@@page.users.message.confirmDelete:Are you sure you want to delete?`,
      "deletedUser": $localize `:@@page.users.message.deleted:The user was deleted with success`,
      "emailMandatory": $localize `:@@page.users.message.emailMandatory:Email is mandatory.`,
      "CCIMandatory": $localize `:@@page.users.message.CCIMandatory:CCI is mandatory.`,
      "updatedProfile": $localize `:@@page.users.message.updatedProfile:Your profile was updated.`,
      "pleaseUpdatedProfile": $localize `:@@page.users.message.pleaseUpdatedProfile:Please, update your profile data.`,
    },
    labels:{
      "dialogTitleAddUser": $localize `:@@page.users.label.dialogTitleAddUser:Add user`,
      "dialogTitleEditUser": $localize `:@@page.users.label.dialogTitleEditUser:Edit user`,
      "dialogTitleInviteUser": $localize `:@@page.users.label.dialogTitleInviteUser:Invite user`,
      "activeYES": $localize `:@@page.users.label.activeYES:YES`,
      "activeNO": $localize `:@@page.users.label.activeNO:NO`,
      "never": $localize `:@@page.users.label.never:Never`,
      'AllCCIs': $localize `:@@page.users.label.AllCCIs:All CCIs`,
    },
    buttons:{
      "actionSave": $localize `:@@page.users.button.action.save:Save`,
      "actionCancel": $localize `:@@page.users.button.action.cancel:Cancel`,
      "sendInvitation": $localize `:@@page.users.button.action.sendInvitation:Send invitation`,
    }
  }

  public editManagement:any = {
    messages:{
      "confirmDeleteItem": $localize `:@@page.edits.message.confirmDeleteItem:Are you sure you want to delete this item?`,
      "discardChanges": $localize `:@@page.edits.message.discardChanges:Do you want to discard the changes?`,
      "confirmDeleteVersion": $localize `:@@page.edits.message.confirmDeleteVersion:Do you want to delete this version?`,
      "noChangeDetected": $localize `:@@page.edits.message.noChangeDetected:There is no change detected.`,
      "submittedMessage": $localize `:@@page.edits.message.submittedMessage:The version was submitted and will be revised by a reviewer.`,
      "approvedMessage": $localize `:@@page.edits.message.approvedMessage:The version was approved and will be published as soon as possible. Every week, we will inform you by email about the status of your edits.`,
    },
    labels:{
      "dialogTitleFilters": $localize `:@@page.edits.label.dialogTitleFilters:Filters`,
    },
    buttons:{
      "actionApply": $localize `:@@page.edits.button.action.apply:Apply`,
      "actionSave": $localize `:@@page.edits.button.action.save:Save`,
      "actionCancel": $localize `:@@page.edits.button.action.cancel:Cancel`
    },
    status:{
      "draft": $localize `:@@page.edits.label.status.draft:DRAFT`,
      "submitted": $localize `:@@page.edits.label.status.submitted:SUBMITTED`,
      "approved": $localize `:@@page.edits.label.status.approved:APPROVED`,
      "published": $localize `:@@page.edits.label.status.published:PUBLISHED`
    }
  }
  paramMapping = {
    [this.queryParams.keywords]: 'keywords',
    [this.queryParams.town]: 'town',
    [this.queryParams.country]: 'countries',
    [this.queryParams.region]: 'regions',
    [this.queryParams.policyObjective]: 'policy_objectives',
    [this.queryParams.theme]: 'thematic_objectives',
    [this.queryParams.programPeriod]: 'programmingPeriods',
    [this.queryParams.fund]: 'funds',
    [this.queryParams.programme]: 'programs',
    [this.queryParams.totalProjectBudget]: 'totalProjectBudget',
    [this.queryParams.amountEUSupport]: 'amountEUSupport',
    [this.queryParams.projectStart]: 'projectStart',
    [this.queryParams.projectEnd]: 'projectEnd',
    [this.queryParams.interreg]: 'interreg',
    [this.queryParams.nuts3]: 'nuts3',
    [this.queryParams.sort]: 'sort',
    [this.queryParams.priorityAxis]: 'priority_axis',
    [this.queryParams.projectCollection]: 'project_types',
    [this.queryParams.interventionField]: 'categoriesOfIntervention',
    [this.queryParams.sdg]: 'sdg'
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
      let finalUrl=`/${localeTo}`;
      let segments:UrlSegment[] = [];
      if ((this.router.parseUrl(this.router.url).root.hasChildren())||
        queryParams && queryParams.keys.length){
        this.getLocaleFile(localeTo).subscribe(data => {
          this.translations = data.translations;
          if (this.router.parseUrl(this.router.url).root.hasChildren()){
            segments = this.router.parseUrl(this.router.url).root.children['primary'].segments;
            const resultSegments = this.buildSegments(segments);
            finalUrl += resultSegments;
          }
          if (queryParams && queryParams.keys.length){
            const newQueryParams:any = {};
            const filters:Array<Observable<any>> = [];
            queryParams.keys.forEach((queryParam:string)=>{
              const queryParamKey = this.getQueryParamKeyFromLabel(queryParam);
              if (queryParamKey) {
                let transParamKey = this.getTranslatedLabel("translate.queryParams.",queryParamKey);
                if (!transParamKey){
                  transParamKey = queryParamKey;
                }
                let transParamValue = queryParams.get(queryParam);
                if (this.queryParamToFilter[queryParamKey]) {
                  const qID = this.filterService.getFilterKey(this.queryParamToFilter[queryParamKey], queryParams.get(queryParam));
                  if (qID) {
                    filters.push(
                      this.filterService.getFilter(this.queryParamToFilter[queryParamKey],{qid:environment.entityURL+qID, language: localeTo})
                        .pipe(map((value:any) => {
                          let label = value[this.queryParamToFilter[queryParamKey]][0].value;
                          if (queryParamKey == 'region'){
                            label = value[this.queryParamToFilter[queryParamKey]][0].name;
                          }
                          if (label){
                            label = label.split(' ').join('-');
                          }
                          return ({type: transParamKey, value: label})
                        }))
                    )
                  }
                }else if(this.isStaticFilter(queryParamKey)){
                  let filterkeyParam = queryParamKey;
                  if (queryParamKey == 'sort' && this.isPage('projects', segments)){
                    filterkeyParam += 'Projects';
                  }else if (queryParamKey == 'sort' && this.isPage('beneficiaries', segments)){
                    filterkeyParam += 'Beneficiaries';
                  }
                  if (transParamValue) {
                    const paramKeyLabel = this.filterService.getFilterKey(queryParamKey == "sortProjects" ? "sort": queryParamKey,transParamValue);
                    if (paramKeyLabel) {
                      const transStaticLabel = this.getTranslatedLabel('translate.filter.sortProjects.',this.translationsStaticFiltersKey[filterkeyParam][paramKeyLabel]);
                      if (transStaticLabel){
                        transParamValue = transStaticLabel.split(' ').join('-');
                      }
                    }
                  }

                }
                if (transParamKey && transParamValue) {
                  newQueryParams[transParamKey] = transParamValue;
                }
              }
            })
            if (filters && filters.length){
              forkJoin(filters).subscribe((results:any)=>{
                results.forEach((result:any)=>{
                  newQueryParams[result.type] = result.value;
                })
                finalUrl += this.buildQueryParams(newQueryParams);
                observer.next(finalUrl);
              });
            }else{
              finalUrl += this.buildQueryParams(newQueryParams);
              observer.next(finalUrl);
            }
          }else{
            observer.next(finalUrl);
          }
        });
      }else{
        observer.next(finalUrl);
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

  private isPage(path:string, segments:UrlSegment[]): boolean{
    let result:boolean = false;
    if (segments && segments.length){
      const keySegment = this.getRouteKeyFromLabel(segments[0].path.replace("/",""));
      if (keySegment==path){
        result = true;
      }
    }
    return result;
  }

  private buildQueryParams(queryParams:any){
    let result:string = "";
    let i = 0;
    for (let key of Object.keys(queryParams)) {
      result += i == 0 ? '?' : '&';
      result += key + '=' + queryParams[key]
      i++;
    }
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

  private getQueryParamKeyFromLabel(label:string): string | undefined{
    for (let key of Object.keys(this.queryParams)) {
      const value:string = this.queryParams[key as keyof typeof this.queryParams];
      if (value == label){
        return key;
      }
    }
    return undefined;
  }

  private getTranslatedLabel(preKey:string, keySegment:string=""):string | undefined{
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

  public getLocaleLabel(locale: string, labelKey:string):Promise<string | undefined>{
    return new Promise((resolve, reject) => {
      this.getLocaleFile(locale).subscribe(data=>{
        for (let key in data.translations){
          if (key==labelKey){
            resolve(data.translations[key]);
          }
        }
        reject();
      });
    })
  }

  private isStaticFilter(type:string){
    return type == 'sort' || type == 'beneficiaryType' || type == 'interreg';
  }

}
