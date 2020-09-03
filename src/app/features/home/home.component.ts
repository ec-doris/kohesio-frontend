import {AfterViewInit, Component, ViewChild} from '@angular/core';
declare let L;
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import {FilterService} from "../../services/filter.service";
import {MapComponent} from "../../shared/components/map/map.component";
import {Filters} from "../../shared/models/filters.model";
import {StatisticsService} from "../../services/statistics.service";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    @ViewChild(MapComponent) map: MapComponent;

    public stats:any = {};

    constructor(private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document,
                private _router: Router,
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
    }

}
