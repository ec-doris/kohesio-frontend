let countrySelect;
let topicSelect;
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const server = 'https://query.linkedopendata.eu/bigdata/namespace/wdq/sparql';

function formatBudget (value) {
    // Nine Zeroes for Billions
    return Math.abs(Number(value)) >= 1.0e+9
        ? (Math.abs(Number(value)) / 1.0e+9).toFixed(0) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(value)) >= 1.0e+6
            ? (Math.abs(Number(value)) / 1.0e+6).toFixed(0) + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(value)) >= 1.0e+3
                ? (Math.abs(Number(value)) / 1.0e+3).toFixed(0) + "K"
                : Math.abs(Number(value)).toFixed(0);
}

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
            placeholder: 'All countries',
            select: '#countries-select'
        });
        const countriesData = [];
        for(let country of json.countries){
            countriesData.push({
                value: country[0],
                text: country[1],
                innerHTML: '<img src="images/flags/'+country[0].split(',')[1].toLowerCase()+'.png">'+country[1]
            })
        }
        countrySelect.setData(countriesData);

        /*TOPICS SELECT*/
        topicSelect = new SlimSelect({
            placeholder: 'All topics',
            select: '#topics-select'
        });
        const topicsData = [];
        for(let topic of json.topics){
            topicsData.push({
                value: topic[0],
                text: topic[1],
                innerHTML: '<img src="images/'+topic[0]+'_80.png">'+topic[1]
            })
        }
        topicSelect.setData(topicsData);
    })
    .catch(function () {
        this.dataError = true;
    });

//Getting the project details

function getProjectList() {
    const queryProjects = 'SELECT DISTINCT ?s0 ?label ?description ?startTime ?euBudget ?image ?coordinates ?objectiveId ?countrycode WHERE { ' +
        '  ?s0 <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934>. ' +
        '  { ' +
        '    ?s0 rdfs:label ?label. ' +
        '    FILTER((LANG(?label)) = "en") ' +
        '  }' +
        '  {' +
        '    ?s0 <https://linkedopendata.eu/prop/direct/P836> ?description. ' +
        '    FILTER((LANG(?description)) = "en")' +
        '  }' +
        '  { ?s0 <https://linkedopendata.eu/prop/direct/P20> ?startTime. } ' +
        '  { ?s0 <https://linkedopendata.eu/prop/direct/P835> ?euBudget. }' +
        '  OPTIONAL { ?s0 <https://linkedopendata.eu/prop/direct/P147> ?image. }' +
        '  OPTIONAL { ?s0 <https://linkedopendata.eu/prop/direct/P851> ?image. }' +
        '  { ?s0 <https://linkedopendata.eu/prop/direct/P127> ?coordinates. }' +
        '  { ?s0 <https://linkedopendata.eu/prop/direct/P888> ?category. }' +
        '  { ?category <https://linkedopendata.eu/prop/direct/P302> ?objective. }' +
        '  { ?objective <https://linkedopendata.eu/prop/direct/P1105> ?objectiveId. }' +
        '  { ?s0 <https://linkedopendata.eu/prop/direct/P32> ?country .}' +
        '  { ?country <https://linkedopendata.eu/prop/direct/P173> ?countrycode .}' +
        generateFilters() +
        '}' +
        'LIMIT 12';
    const urlProjects = encodeURI(server + '?query=' + queryProjects);
    fetch(urlProjects, {
        headers: {
            'Accept': 'application/sparql-results+json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    }).then(json => {
        let html = '';
        let i = 1;
        for (let project of json.results.bindings) {
            //let objectiveId = (i<10 ? "TO0" : "TO") + i;
            let objectiveId = project.objectiveId.value;
            let title = project.label.value.length > 60 ?
                project.label.value.substring(0, 60) + '...' :
                project.label.value;
            let description = project.description.value.length > 500 ?
                project.description.value.substring(0, 500) + '...' :
                project.description.value;
            const startTime = new Date(project.startTime.value);
            const startTimeFormatted = months[startTime.getMonth()] + ' ' + startTime.getFullYear();
            let budget = formatBudget(parseInt(project.euBudget.value)) + '€';
            let countryCode = project.countrycode.value;
            let link = project.s0.value;
            html +=
                '<a href="'+link+'" class="project-link" target="_blank">' +
                '<div class="card ' + objectiveId + '">' +
                '<div class="header">' +
                /*'<img src="images/TO'+project.objectiveId.value+'_80.png">' +*/
                '<div class="images">' +
                    '<img class="topic" src="images/' + objectiveId + '_80.png">' +
                    '<img class="flag" src="images/flags/' + countryCode.toLowerCase() + '.png">' +
                '</div>' +
                '<h1>' + title + '</h1>' +
                '</div>' +
                '<div class="info-bar">' +
                '<div class="startDate">' + startTimeFormatted + '</div>' +
                '<div class="budget">' + budget + '</div>' +
                '</div>' +
                '<p>' + description + '</p>' +
                '</div>' +
                '</a>';
            i++;
        }
        document.getElementById('projects-grid').innerHTML = html;
    }).catch(function () {

    });
}

function onSearchClick(){
    const countriesSelected = countrySelect.selected();
    const topicsSelected = topicSelect.selected();
    if (countriesSelected.length > 0 || topicsSelected.length > 0){
        let points = {};
        if (countriesSelected.length > 0) {
            for (let country of countriesSelected) {
                let countryCode = country.split(",")[1];
                points[countryCode] = window.mapDataPoints[countryCode];
            }
        }else{
            points = Object.assign({}, window.mapDataPoints);
        }
        if (topicsSelected.length > 0){
            for (let country in points) {
                let results = [];
                for(let point of points[country]){
                    for (let topic of topicsSelected) {
                        if (point[3] === topic){
                            results.push(point);
                            break;
                        }
                    }
                }
                points[country] = results;
            }
        }
        clearAllLayers();
        setPointsOnMapByCountry(points);
    }else{
        clearAllLayers();
        setPointsOnMapByCountry(window.mapDataPoints);
    }
    getProjectList();
    getCountProjects();
}

function getCountProjects() {
    const countQuery = 'SELECT (COUNT(*) as ?count) WHERE{' +
        '?s0 <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934>.' +
        '?s0 <https://linkedopendata.eu/prop/direct/P32> ?country .' +
        '?country <https://linkedopendata.eu/prop/direct/P173> ?countrycode .' +
        '?s0 <https://linkedopendata.eu/prop/direct/P127> ?coordinates .' +
        '?s0 <https://linkedopendata.eu/prop/direct/P888> ?category .' +
        '?category <https://linkedopendata.eu/prop/direct/P302> ?objective .' +
        '?objective <https://linkedopendata.eu/prop/direct/P1105> ?objectiveId .' +
        generateFilters() +
        '}';
    const urlCount = encodeURI(server + '?query=' + countQuery);
    fetch(urlCount, {
        headers: {
            'Accept': 'application/sparql-results+json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    }).then(json => {
        console.log('COUNT=' + json.results.bindings[0].count.value);
    }).catch(function () {

    });
}

function generateFilters(){
    let filters = '';
    //Country filter
    if (countrySelect) {
        const countriesSelected = countrySelect.selected();
        if (countriesSelected.length > 0) {
            filters += '{';
            for (let i=0; i<countriesSelected.length; ++i) {
                let country = countriesSelected[i];
                let countryCode = country.split(",")[0];
                filters += '{?s0 <https://linkedopendata.eu/prop/direct/P32> <https://linkedopendata.eu/entity/Q' + countryCode + '>}';
                filters += (countriesSelected.length > 1 && i !== countriesSelected.length -1) ? ' UNION' : '';
            }
            filters += '}';
        }
    }
    if (topicSelect) {
        const topicsSelected = topicSelect.selected();
        if (topicsSelected.length > 0) {
            filters += '{';
            for (let i=0; i<topicsSelected.length; ++i) {
                let topic = topicsSelected[i];
                filters += '{?objective <https://linkedopendata.eu/prop/direct/P1105> "' + topic + '"}';
                filters += (topicsSelected.length > 1 && i !== topicsSelected.length -1) ? ' UNION' : '';
            }
            filters += '}';
        }
    }
    return filters;
}

getCountProjects();
getProjectList();
