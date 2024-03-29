import {Inject, Injectable, LOCALE_ID} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {Meta, Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";
import {TranslateService} from "./translate.service";
import {DOCUMENT} from "@angular/common";
import {FilterService} from "./filter.service";

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              private filterService: FilterService,
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
            this.metaService.updateTag({property: 'og:image', content: '/assets/images/map/ogImage.png'})
          }

          //Project list page
          if (this.router.url.startsWith('/' + this.translateService.routes.projects)){
            this.changeProjectListMetadata();
          }

          //Project detail page
          if (data["project"]) {
            const project = data["project"];
            this.titleService.setTitle(project.label+ " | Kohesio");
            this.metaService.updateTag({property: 'og:title', content: project.label+ " | Kohesio"});

            let description = this.translateService.dynamicMetadata.projectDetail.description;
            description += " - " + project.categoryLabels[0];
            description += " - " + project.themeLabels[0];
            description += " - " + project.fundLabel;
            description += " - " + project.regionText;

            this.metaService.updateTag({name: 'description', content: description});

            //Image
            let ogImage:string = "";
            if(project.images && project.images.length) {
              ogImage = data["project"].images[0].image;
            }else if (project.themeIds && project.themeIds.length == 1){
              ogImage = 'assets/images/topics/' + (project.themeIds[0] || 'question_mark') + '.png'
            }else if (project.themeIds && project.themeIds.length > 1){
              ogImage = 'assets/images/topics/TO_multiple.png';
            }
            this.metaService.updateTag({property: 'og:image', content: ogImage})
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

  public async changeProjectListMetadata() {
    let title: string = "";
    let description = this.translateService.dynamicMetadata.projects.titleAlt0;
    const priorityOrder: string[] = ["interventionField", "theme", "policyObjective", "fund", "region", "country"];
    for (const order of priorityOrder) {
      const queryParamTranslated: any = this.translateService.queryParams[order];
      if (!title) {
        if (this.activatedRoute.snapshot.queryParamMap.has(queryParamTranslated)) {
          if (order == "interventionField" || order == "theme" || order == "policyObjective") {
            title = this.translateService.dynamicMetadata.projects.titleAlt3;
          } else if (order == "fund") {
            title = this.translateService.dynamicMetadata.projects.titleAlt1;
          } else {
            title = this.translateService.dynamicMetadata.projects.titleAlt2;
          }
          if (order == "region") {
            const country = await this.filterService.getFilterLabelByLabel("country",
              this.activatedRoute.snapshot.queryParamMap.get(this.translateService.queryParams.country)!);
            const region = await this.filterService.getFilterLabelByLabel(order,
              this.activatedRoute.snapshot.queryParamMap.get(queryParamTranslated)!);
            if (region) {
              title += " " + region + "," + country;
            } else {
              title += " " + country;
            }
          } else {
            const label = this.activatedRoute.snapshot.queryParamMap.get(queryParamTranslated)!;
            let titlePiece = await this.filterService.getFilterLabelByLabel(order, label);
            title += " " + titlePiece;
          }
        }
      }
      if (this.activatedRoute.snapshot.queryParamMap.has(queryParamTranslated)) {
        const label = this.activatedRoute.snapshot.queryParamMap.get(queryParamTranslated)!;
        description += ", " + await this.filterService.getFilterLabelByLabel(order, label);
      }
    }
    if (!title) {
      title = this.translateService.dynamicMetadata.projects.titleAlt0;
    }

    this.titleService.setTitle(title);
    this.metaService.updateTag({property: 'og:title', content: title});
    this.metaService.updateTag({name: 'description', content: description})
  }

  getChild(activatedRoute: ActivatedRoute) : ActivatedRoute{
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }

}
