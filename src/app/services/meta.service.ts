import {Inject, Injectable, LOCALE_ID} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {Meta, Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";
import {TranslateService} from "./translate.service";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              @Inject(DOCUMENT) private _document: Document,
              @Inject(LOCALE_ID) public locale: string,
              private metaService: Meta) {
  }

  run() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {

        const rt = this.getChild(this.activatedRoute)

        rt.data.subscribe(data => {
          this.titleService.setTitle(data["title"])

          if (data["description"]) {
            this.metaService.updateTag({name: 'description', content: data["description"]})
          } else {
            this.metaService.updateTag({name: 'description', content: data["title"]})
          }

          if (environment.production){
            if (data["robots"]) {
              this.metaService.updateTag({name: 'robots', content: data["robots"]})
            } else {
              this.metaService.updateTag({name: 'robots', content: "follow,index"})
            }
          }else{
            this.metaService.updateTag({name: 'robots', content: "none"})
          }

          if (data["ogUrl"]) {
            this.metaService.updateTag({property: 'og:url', content: data["ogUrl"]})
          } else {
            this.metaService.updateTag({property: 'og:url', content: this._document.location.href})
          }

          if (data["ogTitle"] || data["title"]) {
            this.metaService.updateTag({property: 'og:title', content: data["ogTitle"] ? data["ogTitle"] : data["title"]})
          } else {
            this.metaService.removeTag("property='og:title'")
          }

          if (data["ogDescription"] || data["description"]) {
            this.metaService.updateTag({property: 'og:description', content: data["ogDescription"] ? data["ogDescription"] : data["description"]})
          } else {
            this.metaService.removeTag("property='og:description'")
          }

          if (data["ogImage"]) {
            this.metaService.updateTag({property: 'og:image', content: data["ogImage"]})
          } else {
            this.metaService.updateTag({property: 'og:image', content: this._document.location.origin+'/'+this.locale+'/assets/images/map/ogImage.png'})
          }

          //Project list page
          if (this.router.url.startsWith('/' + this.translateService.routes.projects)){
            let title = this.translateService.dynamicMetadata.projects.titleAlt1;
            const hasRegion = this.activatedRoute.snapshot.queryParamMap.has(this.translateService.queryParams.region);
            const hasCountry = this.activatedRoute.snapshot.queryParamMap.has(this.translateService.queryParams.country);
            const hasFund = this.activatedRoute.snapshot.queryParamMap.has(this.translateService.queryParams.fund);
            if ((hasRegion || hasCountry) && hasFund){
              title = this.translateService.dynamicMetadata.projects.titleAlt3;
            }else if((hasRegion || hasCountry) && !hasFund){
              title = this.translateService.dynamicMetadata.projects.titleAlt2;
            }else if(hasFund){
              title = this.translateService.dynamicMetadata.projects.titleAlt4;
            }
            if (title.indexOf("${REGION-COUNTRY}")>-1){
              let countryRegion = "";
              if (hasRegion && hasCountry){
                countryRegion = this.activatedRoute.snapshot.queryParamMap.get(this.translateService.queryParams.region) + '-' +
                  this.activatedRoute.snapshot.queryParamMap.get(this.translateService.queryParams.country);
              }else if(hasRegion && !hasCountry){
                countryRegion += this.activatedRoute.snapshot.queryParamMap.get(this.translateService.queryParams.region);
              }else{
                countryRegion += this.activatedRoute.snapshot.queryParamMap.get(this.translateService.queryParams.country);
              }
              title = title.replace("${REGION-COUNTRY}",countryRegion);
            }
            if (title.indexOf("${FUND}")>-1){
              let fund = this.activatedRoute.snapshot.queryParamMap.get(this.translateService.queryParams.fund) + "";
              title = title.replace("${FUND}",fund);
            }


            this.titleService.setTitle(title);
            this.metaService.updateTag({property: 'og:title', content: title});
            this.metaService.updateTag({name: 'description', content: title})
          }

          //Project detail page
          if (data["project"]) {
            this.titleService.setTitle(data["project"].label+ " | Kohesio");
            this.metaService.updateTag({property: 'og:title', content: data["project"].label+ " | Kohesio"});

            let description = this.translateService.dynamicMetadata.projectDetail.description;
            description = description.replace("${REGION-COUNTRY}",data["project"].regionText);
            description = description.replace("${FUND}",data["project"].fundLabel);
            this.metaService.updateTag({name: 'description', content: description});
            this.metaService.updateTag({property: 'og:image', content: data["project"].images[0].image})
          }

          //Beneficiary detail page
          if (data["beneficiary"]) {
            this.titleService.setTitle(data["beneficiary"].beneficiaryLabel + " | Kohesio");
            this.metaService.updateTag({property: 'og:title', content: data["beneficiary"].beneficiaryLabel+ " | Kohesio"});
            this.metaService.updateTag({name: 'description', content: data["beneficiary"].description })
            this.metaService.updateTag({property: 'og:image', content: data["beneficiary"].images[0]})
          }


        })

      })

  }

  getChild(activatedRoute: ActivatedRoute) : ActivatedRoute{
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }

}
