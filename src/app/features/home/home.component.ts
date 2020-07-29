import {AfterViewInit, Component, ViewChild} from '@angular/core';
declare let L;
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import {FilterService} from "../../services/filter.service";
import {MapComponent} from "../../shared/components/map/map.component";
import {Filters} from "../../shared/models/filters.model";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    @ViewChild(MapComponent) map: MapComponent;

    constructor(private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document,
                private _router: Router){}

    ngAfterViewInit(): void {
        setTimeout(
            () => {
                this.map.loadMapRegion(new Filters());
            }, 500);
    }

    public ngOnInit() {
    }

}
