import { AfterViewInit, Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';

@Component({
    selector: 'app-ecl-site-header',
    templateUrl: './site-header.ecl.component.html',
    styleUrls: ['./site-header.ecl.component.scss']
})

export class SiteHeaderEclComponent implements AfterViewInit {

    public searchkeywords:string | null | undefined = "";

    constructor(private router:Router) {

        this.router.events.subscribe(event => {
            if(event instanceof ActivationEnd) {
                if (event.snapshot.queryParams['keywords']){
                    this.searchkeywords =  event.snapshot.queryParams['keywords'];
                }
            }
        });
        
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
