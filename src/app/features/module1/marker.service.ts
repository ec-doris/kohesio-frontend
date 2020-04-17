import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
declare let L;
import * as pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

    private mapDataPoints;

    constructor(private http: HttpClient) { }

    public getServerPoints(): Promise<any>{
        return new Promise((resolve,reject)=> {
            if (!this.mapDataPoints) {
                fetch('assets/data/points.gzip').then(response => {
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.arrayBuffer();
                }).then(arrayBuffer => {
                    const byteArray = new Uint8Array(arrayBuffer);
                    const data = pako.ungzip(byteArray, {to: 'string'});
                    this.mapDataPoints = JSON.parse(data);
                    resolve(true);
                }).catch(function () {
                    reject(false);
                });
            } else {
                resolve(true);
            }
        });
    }

    public makeMarkers(map): void {
        if (!this.mapDataPoints) {
            fetch('assets/data/points.gzip').then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.arrayBuffer();
            }).then(arrayBuffer => {
                const byteArray = new Uint8Array(arrayBuffer);
                const data = pako.ungzip(byteArray, {to: 'string'});
                this.mapDataPoints = JSON.parse(data);
                this.setPointsOnMapByCountry(this.mapDataPoints, map);
            }).catch(function () {
            });
        }else{
            this.setPointsOnMapByCountry(this.mapDataPoints, map);
        }
    }

    private setPointsOnMapByCountry(data, map){
        if (!data){
            return;
        }
        const countryLayers = [];
        for(let country in data){
            const markersListPerCountry = [];
            const markers = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 120,
                chunkedLoading: true,
                spiderfyOnMaxZoom: false,
                zoomToBoundsOnClick:false,
                maxZoom: 18,
                iconCreateFunction: function(cluster) {
                    const total = cluster.getAllChildMarkers().length;
                    let iconSize;
                    let className = "mycluster ";
                    if (total<= 10){
                        iconSize = L.point(30, 30);
                        className += "size1";
                    }else if(total <=100){
                        iconSize = L.point(35, 35);
                        className += "size2";
                    }else if(total <= 1000) {
                        iconSize = L.point(40, 40);
                        className += "size3";
                    }else if(total <= 10000) {
                        iconSize = L.point(45, 45);
                        className += "size4";
                    }else {
                        iconSize = L.point(50, 50);
                        className += "size5";
                    }
                    return L.divIcon({ html: '<div>'+total+'</div>', className: className, iconSize: iconSize });
                }
            });
            markers.on('clusterclick', (a)=>{
                const maxZoom = map.getMaxZoom();
                let cluster = a.layer,
                    bottomCluster = cluster;

                while (bottomCluster._childClusters.length === 1) {
                    bottomCluster = bottomCluster._childClusters[0];
                }

                if (bottomCluster._zoom === maxZoom &&
                    bottomCluster._childCount === cluster._childCount) {
                    if (bottomCluster._childCount > 100) {
                        map.openPopup('<p>Cluster with too many points!</p>', a.layer.getLatLng());
                    }else{
                        a.layer.spiderfy();
                    }
                }else{
                    a.layer.zoomToBounds();
                }
            });
            for(let point of data[country]){
                const marker = L.marker(L.latLng(point[2], point[1]), {id: point[0]});
                marker.on('click', this.markerOnClick);
                markers.addLayer(marker);
            }
            countryLayers.push(markers);
        }
        for(let layer of countryLayers) {
            map.addLayer(layer);
        }
    }

    private markerOnClick(e){
        const id = e.target.options.id;
        const projectUrl = 'https://linkedopendata.eu/wiki/Item:Q' + id;
        const server = 'https://query.linkedopendata.eu/bigdata/namespace/wdq/sparql';
        const query = 'select ?label ?description where {' +
            '<https://linkedopendata.eu/entity/Q' + id + '> rdfs:label ?label.' +
            '<https://linkedopendata.eu/entity/Q' + id + '> <https://linkedopendata.eu/prop/direct/P836> ?description .' +
            'FILTER (langMatches( lang(?label), "en" ) )' +
            'FILTER (lang(?description) = \'en\')' +
            '}';
        const url = server + '?query=' + query;
        fetch(encodeURI(url),{
            headers: {
                'Accept': 'application/sparql-results+json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        }).then(json => {
            let title = projectUrl;
            let description = '';
            if (json.results.bindings.length > 0) {
                title = json.results.bindings[0].label.value;
                description = json.results.bindings[0].description.value;
            }
            const htmlContent = '<div>' +
                '<h4><a href="' + projectUrl + '" class="map-marker" target="_blank">' + title + '</a></h4>' +
                '<div style="display:flex;align-items: center;">' +
                '<p style="overflow:hidden;">' + description + '</p>';

            const popup = L.popup({maxWidth:600})
                .setContent(htmlContent)

            e.target.bindPopup(popup).openPopup();
        }).catch(function () {

        });
    }

}
