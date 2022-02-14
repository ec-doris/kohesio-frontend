import {AfterViewInit, Component} from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';

@Component({
    selector: 'app-ecl-site-header',
    templateUrl: './site-header.ecl.component.html',
    styleUrls: ['./site-header.ecl.component.scss']
})

export class SiteHeaderEclComponent implements AfterViewInit {

    public url: string | undefined;
    
    constructor(private router: Router){
        this.router.events.subscribe(event => {
            if(event instanceof NavigationEnd) {
                console.log(event.url);
                this.url = event.url;
            }
        });
    }

    ngOnInit(){
    }

    ngAfterViewInit(): void {
    }

}
