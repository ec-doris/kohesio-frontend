let countrySelect;
let topicSelect;

fetch('filters.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {
        /*COUNTRIES SELECT*/
        countrySelect = new SlimSelect({
            select: '#countries-select'
        });
        const countriesData = [];
        for(let country of json.countries){
            countriesData.push({
                value: country[0],
                text: country[1]
            })
        }
        countrySelect.setData(countriesData);

        /*TOPICS SELECT*/
        topicSelect = new SlimSelect({
            select: '#topics-select'
        });
        const topicsData = [];
        for(let topic of json.topics){
            topicsData.push({
                text: topic[1]
            })
        }
        topicSelect.setData(topicsData);
    })
    .catch(function () {
        this.dataError = true;
    });

function onSearchClick(){
    const countriesSelected = countrySelect.selected();
    if (countriesSelected.length > 0){
        const points = {};
        for(let country of countriesSelected){
            let countryCode = country.split(",")[1];
            points[countryCode] = window.mapDataPoints[countryCode];
        }
        clearAllLayers();
        setPointsOnMapByCountry(points);
    }else{
        clearAllLayers();
        setPointsOnMapByCountry(window.mapDataPoints);
    }
}
