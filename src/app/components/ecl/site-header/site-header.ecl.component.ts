import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-ecl-site-header',
    templateUrl: './site-header.ecl.component.html',
    styleUrls: ['./site-header.ecl.component.scss']
})

export class SiteHeaderEclComponent implements AfterViewInit {

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
    }
    
    
    onClick(event: Event) {
        let element = document.getElementById('closeMenu');
        if(element) element.click();
    }

}
