L.custom = {
    init: function (obj, params) { // this method is run as soon as the core loading process is loaded

        window.map = L.map(obj, {
            center: [48, 4],
            zoom: 5,
            background: "osmec"
        });

        fetch('points.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                console.log("RENDERED IS STARTED " + window.performance.now());
                this.points = json;
                window.layersCountriesRendered = 5;

                function updateProgressBar(processed, total, elapsed, layersArray) {
                    if (processed === total) {
                        window.layersCountriesRendered = window.layersCountriesRendered - 1;
                        if (window.layersCountriesRendered === 0) {
                            console.log("RENDERED IS FINISHED " + window.performance.now());
                            $wt._queue("next");
                        }
                    }
                }

                const markerOnClick = function(e){
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
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("HTTP error " + response.status);
                            }
                            return response.json();
                        })
                        .then(json => {
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
                        })
                        .catch(function () {
                            this.dataError = true;
                        });
                };

                const countryLayers = [];
                for(let country in this.points){
                    const markersListPerCountry = [];
                    const markers = L.markerClusterGroup({
                        showCoverageOnHover: false,
                        maxClusterRadius: 120,
                        chunkedLoading: true,
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
                    for(let point of this.points[country]){
                        const marker = L.marker(L.latLng(point[2], point[1]), {id: point[0]});
                        marker.on('click', markerOnClick);
                        markers.addLayers(marker);
                    }
                    countryLayers.push(markers);
                }
                for(let layer of countryLayers) {
                    map.addLayer(layer);
                }


            })
            .catch(function () {
                this.dataError = true;
            })

    }
}
