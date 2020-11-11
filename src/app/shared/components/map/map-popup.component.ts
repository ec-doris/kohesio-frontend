import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';

@Component({
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent {

    @Input() projects: any[];

    constructor(){}

}
