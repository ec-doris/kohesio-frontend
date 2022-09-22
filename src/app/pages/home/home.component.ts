import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import { DOCUMENT } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
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
                private dialog: MatDialog){

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
            maxWidth: "100%",
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
        setTimeout(
            () => {
                this.map.loadMapRegion(new Filters());
            }, 500);


    }

    public ngOnInit() {
        // setInterval((() => {
        //     this.index = (this.index === 2) ? 0 : this.index + 1;
        // }), 5000);
    }


    onFilter(){
        if (this.filterValue && this.filterValue.trim() != "") {
            this._router.navigate(['/projects'], { queryParams: { keywords: this.filterValue } });
            this.filterValue = "";
        }
    }

}
