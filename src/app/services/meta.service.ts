import {Injectable} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {Meta, Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
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
            this.metaService.removeTag("name='description'")
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
            this.metaService.updateTag({property: 'og:url', content: this.router.url})
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
            this.metaService.removeTag("property='og:image'")
          }

          //Project detail page
          if (data["project"]) {
            this.titleService.setTitle(data["project"].label+ " | Kohesio");
            this.metaService.updateTag({property: 'og:title', content: data["project"].label+ " | Kohesio"});
            this.metaService.updateTag({name: 'description', content: data["project"].description})
          }

          //Beneficiary detail page
          if (data["beneficiary"]) {
            this.titleService.setTitle(data["beneficiary"].beneficiaryLabel + " | Kohesio");
            this.metaService.updateTag({property: 'og:title', content: data["beneficiary"].beneficiaryLabel+ " | Kohesio"});
            this.metaService.updateTag({name: 'description', content: data["beneficiary"].description })
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
