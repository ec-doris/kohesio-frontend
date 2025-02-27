import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import { Filters } from 'src/app/models/filters.model';
import { PolicyObjective } from 'src/app/models/policy-objective.model';
import { Statistics } from 'src/app/models/statistics.model';
import { Theme } from 'src/app/models/theme.model';
import { StatisticsService } from 'src/app/services/statistics.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ProjectDetailModalComponent } from '../../components/kohesio/project-detail-modal/project-detail-modal.component';
import { TransferStateService } from '../../services/transfer-state.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomePageComponent implements AfterViewInit {

  @ViewChild(MapComponent) map!: MapComponent;

  // public index = 0;
  public stats?: Statistics;
  filterValue: string = '';
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
              @Inject(PLATFORM_ID) private platformId: object,
              public transferStateService: TransferStateService) {

    this.statisticsService.getKeyFigures().subscribe((data: Statistics) => {
      this.stats = data;
    });
    this.themeService.getThemes().subscribe((themes) => {
      this.homePageThemes = themes.filter((theme: Theme) => {
        return theme.id == 'TO04' || theme.id == 'TO05' || theme.id == 'TO06';
      });
    });
    this.themeService.getPolicyObjectives().subscribe((policyObjectives) => {
      const policy = policyObjectives.find((policyObjective: PolicyObjective) => {
        return policyObjective.id == 'PO02';
      });
      if (policy) {
        this.policyObjective = policy;
      }
    });

    if (this._route.snapshot.queryParamMap.has('project')) {
      this.dialog.open(ProjectDetailModalComponent, {
        width: '90%',
        maxWidth: '1300px',
        maxHeight: '100%',
        position: { top: '10px' },
        panelClass: 'project-detail-modal',
        data: {
          id: this._route.snapshot.queryParamMap.get('project')
        }
      }).afterClosed().subscribe(() => {
        this.updateCoordsQueryParam();
      });
    }

  }

  ngAfterViewInit(): void {
    // if (this.isPlatformBrowser()) {
    //   setTimeout(
    //     () => {
    //       if (!this._route.snapshot.queryParamMap.keys.length) {
    //         this.map.loadMapRegion(new Filters());
    //       }
    //     }, 500);
    // }
  }

  public ngOnInit() {
    // setInterval((() => {
    //     this.index = (this.index === 2) ? 0 : this.index + 1;
    // }), 5000);
  }

  getThemeURL(theme: string): Params {
    return {
      [this.translateService.queryParams.theme]: theme.split(' ').join('-'),
      [this.translateService.queryParams.policyObjective]: this.policyObjective.instanceLabel.split(' ').join('-')
    };
  }

  getPolicyURL(policy: string): Params {
    return {
      [this.translateService.queryParams.policyObjective]: policy.split(' ').join('-')
    };
  }

  isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  updateCoordsQueryParam() {
    let fragment: string | undefined = this._route.snapshot.fragment + '';
    if (!this._route.snapshot.fragment) {
      fragment = undefined;
    }
    this._router.navigate([], {
      relativeTo: this._route,
      fragment: fragment,
      queryParams: {
        project: undefined
      },
      queryParamsHandling: 'merge'
    });
  }


}
