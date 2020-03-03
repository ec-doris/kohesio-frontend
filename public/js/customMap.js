window.map = L.map('mapId').setView([48, 4], 5);

/*Osmec2 European Commission Open Street Map version 2*/
L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
        '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
}).addTo(window.map);


fetch('points.json').then(response => {
    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return response.json();
}).then(json => {
    window.mapDataPoints = json;
    setPointsOnMapByCountry(window.mapDataPoints);
}).catch(function () {
    this.dataError = true;
});

function markerOnClick(e){
    const id = e.target.options.id;
    const projectUrl = 'https://linkedopendata.eu/wiki/Item:Q' + id;
    const server = 'https://query.linkedopendata.eu/bigdata/namespace/wdq/sparql';
    const query = 'select * where {' +
        '<https://linkedopendata.eu/entity/Q'+id+'> rdfs:label ?label.' +
        'FILTER (langMatches( lang(?label), "en" ) )' +
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
        if (json.results.bindings.length > 0) {
            title = json.results.bindings[0].label.value;
        }
        let description = '';
        const htmlContent = '<div>' +
            '<h4><a href="' + projectUrl + '" class="map-marker" target="_blank">' + title + '</a></h4>' +
            '<div style="display:flex;align-items: center;">' +
            '<p style="overflow:hidden;">' + description + '</p>';

        const popup = L.popup({maxWidth:600})
            .setContent(htmlContent)

        e.target.bindPopup(popup).openPopup();
    }).catch(function () {
        this.dataError = true;
    });
}

function updateProgressBar(processed, total, elapsed, layersArray){
    if (processed === total) {
        window.layersCountriesRendered = window.layersCountriesRendered - 1;
        if (window.layersCountriesRendered === 0) {
            const time = (window.performance.now() - window.mapStartRenderer) / 1000;
            console.log("MAP RENDERED IS FINISHED TOOK: " + time.toFixed(2) + 'sec');
        }
    }
}

function setPointsOnMapByCountry(data){
    window.mapStartRenderer = window.performance.now();
    //console.log("RENDERED IS STARTED " + window.performance.now());
    const countryLayers = [];
    window.layersCountriesRendered = Object.keys(data).length;
    for(let country in data){
        const markersListPerCountry = [];
        const markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 120,
            chunkedLoading: true,
            spiderfyOnMaxZoom: false,
            zoomToBoundsOnClick:false,
            chunkProgress: updateProgressBar,
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
            marker.on('click', markerOnClick);
            markers.addLayer(marker);
        }
        countryLayers.push(markers);
    }
    for(let layer of countryLayers) {
        map.addLayer(layer);
    }
    window.countryLayers = countryLayers;
}
function clearAllLayers(){
    for (let layer of window.countryLayers){
        layer.clearLayers();
    }
}
