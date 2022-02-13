import { Injectable, APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(private http: HttpClient) { }

    url = environment.configPath;
    private configValues: any = null;

    get config(): any {
        return this.config;
    }

    get apiBaseUrl(){
        return this.configValues.api_url;
    }

    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.url).subscribe((response: any) => {
                this.configValues = response;
                resolve(true);
            });
        });
    }
}

export function ConfigFactory(config: ConfigService) {
    return () => config.load();
}

export function init() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const ConfigModule = {
    init: init
}

export { ConfigModule };
