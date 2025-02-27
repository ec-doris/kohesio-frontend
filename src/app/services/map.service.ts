import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Filters } from '../models/filters.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  resetFilters = false;

  constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) {
  }

  public getMapInfo(filters?: Filters, granularityRegion?: string, bbox?: any, zoom?: any): Observable<any> {
    const url = environment.api + '/map/search';
    let params: any = {};
    // console.trace('getMapInfo');
    if (this.resetFilters) {
      params = {
        zoom: 4,
        boundingBox: '{"_southWest":{"lat":33.94335994657882,"lng":-28.564453125000004},"_northEast":{"lat":70.1403642720717,"lng":68.81835937500001}}',
        language: 'en'
      };
      this.resetFilters = false;
    } else {
      if (filters) {
        params = Object.assign(filters.getMapProjectsFilters());
      }
      if (granularityRegion) {
        params.granularityRegion = granularityRegion;
      }
      params.language = this.locale;
      if (bbox) {
        params.boundingBox = this.boundingBoxToString(bbox);
        params.zoom = zoom;
      }
    }

    return this.http.get<any>(url, { params: <any>params }).pipe(map(data => data));
  }

  boundingBoxToString(bbox: any): string {
    const transformedParams = {
      _southWest: {
        lat: bbox._southWest.lat,
        lng: bbox._southWest.lng
      },
      _northEast: {
        lat: bbox._northEast.lat,
        lng: bbox._northEast.lng
      }
    };
    return JSON.stringify(transformedParams);
  }

  getMapInfoByRegion(params: any, zoomLevel: string, filters: any): Observable<any> {
    const url = environment.api + '/map/search';

    const transformedParams = {
      _southWest: {
        lat: params._southWest.lat,
        lng: params._southWest.lng
      },
      _northEast: {
        lat: params._northEast.lat,
        lng: params._northEast.lng
      }
    };

    let httpParams = new HttpParams().set('boundingBox', JSON.stringify(transformedParams)).set('zoom', zoomLevel).set('language', this.locale);
    Object.entries(filters).forEach(([ key, value ]: [ string, any ]) => {
      if (value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        httpParams = httpParams.set(key, value);
      }
    });
    if (httpParams.get('country') && !httpParams.get('region')) {
      httpParams = httpParams.set('granularityRegion', httpParams.get('country') as any);
    } else if (httpParams.get('region')) {
      httpParams = httpParams.set('granularityRegion', httpParams.get('region') as any);
    }

    return this.http.get<any>(url, { params: httpParams });
  }

  getPointsNearBy(useCluster: boolean): Observable<any> {
    let url = environment.api + '/map/nearby';
    if (useCluster) {
      url += `?useCluster=true&language=${this.locale}`;
    }

    return this.http.get<any>(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  public getProjectsPerCoordinate(coordinates: string, filters?: Filters): Observable<any> {
    const url = environment.api + '/map/point';
    let params: any = filters ? { ...filters.getProjectsFilters() } : {};
    if (params.country && !params.region) {
      params.region = params.country;
    }
    params.coordinate = coordinates;
    params.language = this.locale;

    return this.http.get<any>(url, { params: <any>params }).pipe(
      map(data => {
        return data;
      })
    );
  }

  getProjectsPerCoordinates(coordinates: string, bbox: string, zoom: string, filters?: Filters): Observable<any> {
    const url = environment.api + '/map/point';
    let params: any = filters ? { ...filters.getProjectsFilters() } : {};
    if (params.country && !params.region) {
      params.region = params.country;
    }
    params.coordinate = coordinates;
    params.language = this.locale;
    params.boundingBox = bbox;
    params.zoom = zoom;

    return this.http.get<any>(url, { params: <any>params }).pipe(
      map(data => {
        return data;
      })
    );
  }

  public getOutermostRegions(): Observable<any> {
    const url = environment.api + '/queries/outermost_regions';
    let params: any = {
      language: this.locale
    };
    return this.http.get<any>(url, { params: <any>params }).pipe(
      map((regions: any) => {
        let results: any[] = [];
        regions.forEach((region: any) => {
          results.push({
            label: region.instanceLabel,
            country: region.country.replace(environment.entityURL, ''),
            countryLabel: region.countryLabel,
            id: region.instance.replace(environment.entityURL, '')
          });
        });
        return results;
      })
    );
  }

  public getMapCluster(bbox:string, zoom:number): Observable<any> {
    const url = environment.api + '/map/searchCluster';
    let params: any = {
      boundingBox: JSON.stringify(bbox),
      zoom: zoom
    };
    return this.http.get<any>(url, { params: <any>params }).pipe(
      map(data => {
        return data;
      })
    );
  }

}
