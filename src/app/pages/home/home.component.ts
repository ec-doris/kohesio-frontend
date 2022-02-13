import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Renderer2, Inject } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Filters } from 'src/app/models/filters.model';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements AfterViewInit {

    @ViewChild(MapComponent) map!: MapComponent;

    // public index = 0;
    public stats:any = {};
    filterValue: string = "";

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