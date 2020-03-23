import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { UserState, getUserState, UxLink, UxLanguage } from '@eui/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    userState: Observable<UserState>;

    menuLinks: UxLink[] = [];
    notificationLinks: UxLink[] = [];

    constructor(
        private translateService: TranslateService,
        private store: Store<any>,
    ) {
    }

    ngOnInit() {
        this.userState = <any>this.store.select(getUserState);

        this._createMenuLinks();
        this._createNotifications();
    }

    onLanguageChanged(language: UxLanguage) {
        this.translateService.use(language.code);
    }

    private _createMenuLinks() {
        this.menuLinks = [
            new UxLink(
                {
                    label: 'HOME', url: '/', isHome: true
                }
            ),
            new UxLink(
                {
                    label: 'Map View', url: '/map-view'
                }
            )
        ];
    }

    private _createNotifications() {
        this.notificationLinks = [
            new UxLink(
                { label: 'Notification title', subLabel: 'This is the description of the noficiation' }
            ),
            new UxLink(
                { label: 'Notification title', subLabel: 'This is the description of the noficiation' }
            ),
            new UxLink(
                 { label: 'Notification title', subLabel: 'This is the description of the noficiation' }
            ),
        ];
    }
}
