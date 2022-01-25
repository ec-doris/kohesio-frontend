import {Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
    UserState,
    getUserState,
    UxAppShellService,
    UxLanguage,
    UxLink
} from '@eui/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    userState: Observable<UserState>;
    @Input() selectedLanguage: UxLanguage;
    filterValue: string;
    searchToogleMobile: boolean = false;
    topMenuLinks: UxLink[] = [
        new UxLink({label: 'Home', url: '/', isHome: true, children: [{label:'fake'}]}),
        new UxLink({label: 'Projects',url: 'projects',children: [{label: 'Fake'}]}),
        new UxLink({label: 'Beneficiaries', url: 'beneficiaries', children: [{label:'fake'}]}),
        new UxLink({label: 'Professional Space', urlExternal: 'https://intragate.development.ec.europa.eu/qs_cnect_audit_hub_vp/ecas/hub/stream/c64d563e-d9c9-4e7d-8794-914cd8964567', urlExternalTarget: '_blank'})
    ];
    public currentUrl: string = location.href;
    public breakpointsValue: any = {
        isMobile: false,
        isTablet: false,
        isLtDesktop: false,
        isDesktop: false,
        isXL: false,
        isXXL: false
    };

    constructor(
        private translateService: TranslateService,
        public uxAppShellService: UxAppShellService,
        private store: Store<any>,
        public router: Router
    ) {

    }

    ngOnInit() {
        this.userState = <any>this.store.select(getUserState);
    }

    ngAfterViewInit(): void {
        this.uxAppShellService.breakpoints$.subscribe(bkps => this.breakpointsValue = bkps);
    }

    onLanguageChanged(language: UxLanguage) {
        this.translateService.use(language.code);
    }

    onFilter(){
        if (this.filterValue && this.filterValue.trim() != "") {
            this.router.navigate(['/projects'], { queryParams: { keywords: this.filterValue } });
            this.filterValue = "";
            this.searchToogleMobile = false;
        }
    }

}
