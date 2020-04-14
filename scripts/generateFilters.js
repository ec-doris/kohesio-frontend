const axios = require('axios');
const fs = require('fs');

const server = 'http://query.linkedopendata.eu/bigdata/namespace/wdq/sparql';
const queryGetCountries = 'select distinct (CONCAT(CONCAT(REPLACE(STR(?country),".*Q",""), ","), ?countrycode) AS ?countryId) ?countryLabel where {' +
    '?s <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934> .' +
    '?s <https://linkedopendata.eu/prop/direct/P32> ?country .' +
    '?country <https://linkedopendata.eu/prop/direct/P173> ?countrycode .' +
    'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }' +
    '}';
const queryGetTopics = 'select distinct ?objectiveId ?objectiveLabel where {\n' +
    '?s <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934> .\n' +
    '?s <https://linkedopendata.eu/prop/direct/P888> ?category .\n' +
    '?category <https://linkedopendata.eu/prop/direct/P302> ?objective .\n' +
    '?objective <https://linkedopendata.eu/prop/direct/P1105> ?objectiveId .\n' +
    'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }\n' +
    '} order by ?objectiveId';

const countriesStatic = [["12,DK","Denmark"],["13,PL","Poland"],["15,IT","Italy"],["2,IE","Ireland"],["20,FR","France"],["25,CZ","Czech Republic"]];
//const topicsStatic = [["TO01","Research and innovation"],["TO02","ICT and broadband"],["TO03","Competitiveness of SMEs"],["TO04","Low carbon economy"],["TO05","Climate change adaptation and risk management"],["TO06","Environment and resource efficiency"],["TO07","Transport and key network infrastructures"],["TO08","Employment and labour mobility"],["TO09","Social inclusion and combating poverty"],["TO10","Education, training and vocational training"],["TO11","Institutional capacity efficient public administration"]];
const topicsStatic = [["TO01,Q236689","Research and innovation"],["TO02,Q236690","ICT and broadband"],["TO03,Q236691","Competitiveness of SMEs"],["TO04,Q236692","Low carbon economy"],["TO05,Q236693","Climate change adaptation and risk management"],["TO06,Q236694","Environment and resource efficiency"],["TO07,Q236695","Transport and key network infrastructures"],["TO08,Q236696","Employment and labour mobility"],["TO09,Q236697","Social inclusion and combating poverty"],["TO10,Q236698","Education, training and vocational training"],["TO11,Q236699","Institutional capacity efficient public administration"]];

class GenerateFilters{
    constructor() {
    }
    run(){
        //const countriesPromise = this.getValuesUsingQuery(queryGetCountries, 'countryId', 'countryLabel');
        const countriesPromise = new Promise((resolve,reject)=>{
           resolve(countriesStatic);
        });
        //const topicsPromise = this.getValuesUsingQuery(queryGetTopics, 'objectiveId', 'objectiveLabel');
        const topicsPromise = new Promise((resolve,reject)=>{
            resolve(topicsStatic);
        });
        Promise.all([countriesPromise, topicsPromise]).then(results=>{
            const jsonFile = {
                countries: results[0].isAxiosError ? [] : results[0],
                topics: results[1].isAxiosError ? [] : results[1]
            };
            fs.mkdir('src/assets/data', { recursive: true }, (err) => {
                fs.writeFile('src/assets/data/filters.json', JSON.stringify(jsonFile), (err) => {
                    if (err) throw err;
                    console.log('INFO: File filters.json is created successfully.');
                });
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
