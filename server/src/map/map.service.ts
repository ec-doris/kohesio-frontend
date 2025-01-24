import {Logger, Injectable, Inject} from "@nestjs/common";
import {firstValueFrom, map, throwError} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {plainToInstance} from "class-transformer";
import {catchError} from "rxjs/operators";
import {Request} from 'express';
import {CACHE_MANAGER, Cache} from "@nestjs/cache-manager";
const Supercluster = require("fix-esm").require("supercluster").default;

import {
  MapSearchInDTO,
  MapSearchNearbyOutDTO,
  MapSearchOutDTO,
  MapSearchPointInDTO,
  MapSearchPointOutDTO
} from "./map.dto";


@Injectable()
export class MapService {

  private readonly baseUrl:string;
  private readonly baseUrlEditor:string;
  private readonly logger = new Logger(MapService.name);

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.baseUrl = configService.get<string>('BACKEND_QUERY_HOST');
    this.baseUrlEditor = configService.get<string>('BACKEND_EDITOR_HOST') + '/coordinates';
  }

  async getMapRegions(params: MapSearchInDTO):Promise<MapSearchOutDTO>{
    return await firstValueFrom(
      this.httpService.get<MapSearchOutDTO>(`${this.baseUrl}/search/project/map`,{
        params: params,
        paramsSerializer: {
          indexes: null
        }
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(MapSearchOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getClusters(params: MapSearchInDTO, initialCache:boolean = false):Promise<any>{
    const cacheUntilZoom = 7;
    if (params.zoom <= 3){
      params.zoom = 4;
    }
    const europeClusters:any= await this.cacheManager.get('europeClusters_'+params.zoom);
    if (europeClusters && params.zoom <= cacheUntilZoom){
      this.logger.debug("CACHE found for zoom="+ params.zoom);
      return europeClusters;
    }else{
      this.logger.debug("CACHE not found for zoom="+ params.zoom);
      if (params.zoom <= cacheUntilZoom){
        params.boundingBox = "{\"_southWest\":{\"lat\":-80,\"lng\":-180},\"_northEast\":{\"lat\":80,\"lng\":180}}"
      }
      const supercluster = await this.getAllPoints(params);
      const boundingBox:any = JSON.parse(params.boundingBox);
      const southWest:any = boundingBox['_southWest'];
      const northEast:any = boundingBox['_northEast'];
      const clusters = supercluster.getClusters([southWest['lng'], southWest['lat'], northEast['lng'], northEast['lat']], params.zoom);
      if (initialCache){
        this.logger.debug("SET INITIAL CACHE europeClusters, zoom=4");
        await this.cacheManager.set('europeClusters_4', clusters, 0);
        this.logger.debug("SET INITIAL CACHE europeClusters, zoom=5");
        await this.cacheManager.set('europeClusters_5', supercluster.getClusters([southWest['lng'], southWest['lat'], northEast['lng'], northEast['lat']], 5), 0);
        this.logger.debug("SET INITIAL CACHE europeClusters, zoom=6");
        await this.cacheManager.set('europeClusters_6', supercluster.getClusters([southWest['lng'], southWest['lat'], northEast['lng'], northEast['lat']], 6), 0);
        this.logger.debug("SET INITIAL CACHE europeClusters, zoom=7");
        await this.cacheManager.set('europeClusters_7', supercluster.getClusters([southWest['lng'], southWest['lat'], northEast['lng'], northEast['lat']], 7), 0);
      }else {
        if (params.zoom <= cacheUntilZoom) {
          this.logger.debug("SET CACHE europeClusters, zoom=" + params.zoom);
          await this.cacheManager.set('europeClusters_' + params.zoom, clusters, 0);
        }
      }
      if (params.zoom >= 8) {
        clusters.map(cluster => {
          delete cluster.properties.coordinates;
          if (cluster.properties.coordsAll == false){
            delete cluster.properties.coords;
          }else{
            cluster.geometry.coordinates = cluster.properties.coords.split(",");
            delete cluster.properties.cluster;
            delete cluster.properties.cluster_id;
            delete cluster.properties.coords;
          }
          delete cluster.properties.coordsAll;
        })
      }
      return clusters;
    }
  }

  async getAllPoints(params: MapSearchInDTO):Promise<any>{
    /*const supercluster:any= await this.cacheManager.get('supercluster');
    if (supercluster) {
      this.logger.debug("CACHE found for supercluster");
      return supercluster;
    }else{*/
      return await firstValueFrom(
        this.httpService.get<any>(`${this.baseUrlEditor}`,{
          params: {
            bounding_box_json: params.boundingBox
          },
          paramsSerializer: {
            indexes: null
          }
        }).pipe(
          map(async (result:any)=>{
            const data:Object[] = result.data;
            this.logger.debug(`POINTS from SERVER = ${data.length}`)
            let supercluster = null;
            if (params.zoom>=8){
              supercluster = new Supercluster({
                log: false,
                radius: 150,
                minPoints:2,
                maxZoom: 20,
                map: (props) => {
                  return {coords: props.coords}
                },
                reduce: (accumulated, props) => {
                  try {
                    accumulated.coordsAll = false
                    if(accumulated.coordinates) {
                      accumulated.coordinates = accumulated.coordinates.replaceAll(props.coords+'-', '');
                      if (accumulated.coordinates == ''){
                        accumulated.coordsAll = true
                      }
                    }
                    accumulated.coordinates = (accumulated.coordinates ? accumulated.coordinates : '') + props.coords + "-";
                  }catch(e){
                    console.log("ERROR", e);
                  }
                }
              });
            }else{
              supercluster = new Supercluster({
                log: false,
                radius: 150,
                minPoints:2,
                maxZoom: 20
              });
            }
            let geoJson = new Array<any>();
            data.map((point:string) => {
              const qid = point[0];
              const y = point[1];
              const x = point[2];
              geoJson.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [x, y]
                },
                "properties": {
                  "qid": qid,
                  "coords": `${x},${y}`
                }
              })
            })
            supercluster.load(geoJson);
            /*await this.cacheManager.set('supercluster', supercluster, 0);
            this.logger.debug("CACHE set for supercluster");*/
            return supercluster;
          }),
          catchError(err => {
            console.log("ERROR",err);
            return this.handlingCatchError(err)
          })
        )
      );
    //}

  }

  async getMapPoints(params: MapSearchPointInDTO):Promise<MapSearchPointOutDTO[]>{
    return await firstValueFrom(
      this.httpService.get<MapSearchPointOutDTO[]>(`${this.baseUrl}/search/project/map/point`,{
        params: params
      }).pipe(
        map((result:any)=>{
          const data:Object[] = result.data;
          return plainToInstance(MapSearchPointOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  async getPointsNearby(req:Request):Promise<MapSearchNearbyOutDTO>{
    const candidates = ["X-Forwarded-For",
      "Proxy-Client-IP",
      "WL-Proxy-Client-IP",
      "HTTP_X_FORWARDED_FOR",
      "HTTP_X_FORWARDED",
      "HTTP_X_CLUSTER_CLIENT_IP",
      "HTTP_CLIENT_IP",
      "HTTP_FORWARDED_FOR",
      "HTTP_FORWARDED",
      "HTTP_VIA",
      "REMOTE_ADDR"];
    const headers = {};
    candidates.forEach(candidate=>{
      headers[candidate] = req.header(candidate);
    })
    return await firstValueFrom(
      this.httpService.get<MapSearchNearbyOutDTO>(`${this.baseUrl}/map/nearby`, {
        headers: headers,
        params: req.query.useCluster ? { useCluster: req.query.useCluster, language: req.query.language } : {}
      }).pipe(
        map((result:any)=>{
          const data:Object = result.data;
          return plainToInstance(MapSearchNearbyOutDTO, data)
        }),
        catchError(err => {
          return this.handlingCatchError(err)
        })
      )
    );
  }

  handlingCatchError(err){
    console.error("Error on Map service:",err.response.data)
    return throwError(err.response);
  }


}
