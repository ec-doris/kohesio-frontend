import {AfterViewInit, Component, ViewChild} from '@angular/core';
declare let L;
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import {MapComponent} from "../../shared/components/map/map.component";
import {Filters} from "../../shared/models/filters.model";
import {StatisticsService} from "../../services/statistics.service";
import { UxAppShellService } from '@eui/core';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    @ViewChild(MapComponent) map: MapComponent;

    public index = 0;
    public stats:any = {};
    filterValue: string;

    constructor(private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document,
                private _router: Router,
                public uxAppShellService: UxAppShellService,
                private statisticsService: StatisticsService){}

    ngAfterViewInit(): void {
        setTimeout(
            () => {
                this.map.loadMapRegion(new Filters());
            }, 500);
        this.statisticsService.getKeyFigures().subscribe((data)=>{
            this.stats = data;
        });
    }

    public ngOnInit() {
        setInterval((() => {
            this.index = (this.index === 2) ? 0 : this.index + 1;
        }), 5000);
    }


    onFilter(){
        if (this.filterValue && this.filterValue.trim() != "") {
            this._router.navigate(['/projects'], { queryParams: { keywords: this.filterValue } });
            this.filterValue = "";
        }
    }

}
