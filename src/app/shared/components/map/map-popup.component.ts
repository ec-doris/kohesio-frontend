import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';

@Component({
    templateUrl: './map-popup.component.html'
})
export class MapPopupComponent {

    @Input() projects: any[];


    constructor(){}

}
