const axios = require('axios');
const fs = require('fs');

const server = 'http://query.linkedopendata.eu/bigdata/namespace/wdq/sparql';
const queryGetCountries = 'select distinct (REPLACE(STR(?country),".*Q","") AS ?countryId) ?countryLabel where {' +
    '?s <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934> .' +
    '?s <https://linkedopendata.eu/prop/direct/P32> ?country .' +
    'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }' +
    '}';
const queryGetTopics = 'select distinct ?objectiveId ?objectiveLabel where {\n' +
    '?s <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934> .\n' +
    '?s <https://linkedopendata.eu/prop/direct/P888> ?category .\n' +
    '?category <https://linkedopendata.eu/prop/direct/P302> ?objective .\n' +
    '?objective <https://linkedopendata.eu/prop/direct/P1105> ?objectiveId .\n' +
    'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }\n' +
    '} order by ?objectiveId';

class GenerateFilters{
    constructor() {
    }
    run(){
        const countriesPromise = this.getValuesUsingQuery(queryGetCountries, 'countryId', 'countryLabel');
        const topicsPromise = this.getValuesUsingQuery(queryGetTopics, 'objectiveId', 'objectiveLabel');
        Promise.all([countriesPromise, topicsPromise]).then(results=>{
            const jsonFile = {
                countries: results[0].isAxiosError ? [] : results[0],
                topics: results[1].isAxiosError ? [] : results[1]
            };
            fs.writeFile('public/filters.json', JSON.stringify(jsonFile), (err) => {
                if (err) throw err;
                console.log('INFO: File filters.json is created successfully.');
            });
        });
    }

    getValuesUsingQuery(query, keyProperty, valueProperty){
        return new Promise((resolve, reject) => {
            const url = server + '?query=' + encodeURI(query);
            axios.get(url).then(response => {
                const filters = response.data.results.bindings;
                const filtersOutput = [];
                for(let filter of filters){
                    filtersOutput.push([
                        filter[keyProperty].value,
                        filter[valueProperty].value
                    ]);
                }
                resolve(filtersOutput);
            }).catch(function (error) {
                console.error("ERROR: When try to generate the filters using = " + query);
                resolve(error);
            });
        })
    }
}

new GenerateFilters().run();
