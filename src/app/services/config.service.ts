import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ConfigService {

    constructor(private http: HttpClient) {
        this.load().then(data => console.log(data));
    }

    url = environment.configPath;
    private configValues: any = null;

    get config() {
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