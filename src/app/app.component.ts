import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    topMenuLinks: UxLink[] = [
        new UxLink({label: 'Home', url: '/', isHome: true}),
        new UxLink({label: 'Projects', url: 'projects'}),
        new UxLink({label: 'Beneficiaries', url: 'beneficiaries'}),
        new UxLink({label: 'Professional Space', url: 'professionaSpace'})
    ];

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

    onLanguageChanged(language: UxLanguage) {
        this.translateService.use(language.code);
    }

    onFilter(event){
        if (this.filterValue && this.filterValue.trim() != "") {
            this.router.navigate(['/projects'], { queryParams: { keywords: this.filterValue } });
            this.filterValue = "";
        }
    }

}
