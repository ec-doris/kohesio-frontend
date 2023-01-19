import {AfterViewInit, Component, PLATFORM_ID, ViewChild} from '@angular/core';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import { DOCUMENT } from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Renderer2, Inject } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Filters } from 'src/app/models/filters.model';
import { ThemeService } from 'src/app/services/theme.service';
import { Theme } from 'src/app/models/theme.model';
import { PolicyObjective } from 'src/app/models/policy-objective.model';
import { Statistics } from 'src/app/models/statistics.model';
import {
  ProjectDetailModalComponent
} from "../../components/kohesio/project-detail-modal/project-detail-modal.component";
import {environment} from "../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "../../services/translate.service";
import { isPlatformBrowser } from '@angular/common';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements AfterViewInit {

    @ViewChild(MapComponent) map!: MapComponent;

    // public index = 0;
    public stats?:Statistics;
    filterValue: string = "";
    public homePageThemes!: Theme[];
    public policyObjective!: PolicyObjective;

    constructor(private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document,
                private _route: ActivatedRoute,
                private _router: Router,
                private statisticsService: StatisticsService,
                private themeService: ThemeService,
                private dialog: MatDialog,
                public translateService: TranslateService,
                @Inject(PLATFORM_ID) private platformId: object){

        this.statisticsService.getKeyFigures().subscribe((data: Statistics)=>{
            this.stats = data;
        });
        this.themeService.getThemes().subscribe((themes)=>{
            this.homePageThemes = themes.filter((theme:Theme)=>{
                return theme.id == "TO04" || theme.id == "TO05" || theme.id == "TO06";
            });
        });
        this.themeService.getPolicyObjectives().subscribe((policyObjectives)=>{
            const policy = policyObjectives.find((policyObjective:PolicyObjective)=>{
                return policyObjective.id == "PO02";
            });
            if (policy){
                this.policyObjective = policy;
            }
        });

        if (this._route.snapshot.queryParamMap.has('project')){
          this.dialog.open(ProjectDetailModalComponent,{
            width: "90%",
            height: "85vh",
            maxWidth: "1300px",
            maxHeight: "100%",
            data: {
              id: this._route.snapshot.queryParamMap.get('project')
            }
          }).afterClosed().subscribe(()=>{
            history.replaceState && history.replaceState(
              null, '', location.pathname + location.search.replace(/[\?&]project=[^&]+/, '').replace(/^&/, '?') + location.hash
            );
          });
        }

    }

    ngAfterViewInit(): void {
      if (this.isPlatformBrowser()){
        setTimeout(
          () => {
            this.map.loadMapRegion(new Filters());
          }, 500);
      }
    }

    public ngOnInit() {
        // setInterval((() => {
        //     this.index = (this.index === 2) ? 0 : this.index + 1;
        // }), 5000);
    }

    getThemeURL(theme:string):Params{
      const sort = $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`.split(' ').join('-');
      return {
        [this.translateService.queryParams.theme]: theme.split(' ').join('-'),
        [this.translateService.queryParams.sort]: sort
      };
    }

    getPolicyURL(policy:string):Params{
      const sort = $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`.split(' ').join('-');
      return {
        [this.translateService.queryParams.policyObjective]: policy.split(' ').join('-'),
        [this.translateService.queryParams.sort]: sort
      };
    }

    isPlatformBrowser(){
      return isPlatformBrowser(this.platformId);
    }


}
