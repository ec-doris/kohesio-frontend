const axios = require('axios');
const fs = require('fs');
const pako = require('pako');

const server = 'http://query.linkedopendata.eu/bigdata/namespace/wdq/sparql';
const query = 'select (REPLACE(STR(?project),".*Q","") AS ?projectid) ?countrycode ?coordinates ?objectiveId where {' +
    '?project <https://linkedopendata.eu/prop/direct/P35> <https://linkedopendata.eu/entity/Q9934> .' +
    '?project <https://linkedopendata.eu/prop/direct/P32> ?country .' +
    '?country <https://linkedopendata.eu/prop/direct/P173> ?countrycode .' +
    '?project <https://linkedopendata.eu/prop/direct/P127> ?coordinates .' +
    '?project <https://linkedopendata.eu/prop/direct/P888> ?category .' +
    '?category <https://linkedopendata.eu/prop/direct/P302> ?objective .' +
    '?objective <https://linkedopendata.eu/prop/direct/P1105> ?objectiveId .' +
    '}';

class GenerateMapPoints{

    constructor() {

    }

    run() {
        console.info("INFO: Getting the points in API and placed into a static file");
        const url = server + '?query=' + encodeURI(query);
        axios({
            method: 'get',
            url: url
        })
            .then(function (response) {
                const points = response.data.results.bindings;
                let resultJSON = {};
                console.log("INFO: Generate " + points.length + " points");
                for(let point of points){
                    if (!resultJSON[point.countrycode.value]){
                        resultJSON[point.countrycode.value] = [];
                    }
                    const coordinates = point.coordinates.value.replace("Point(", "")
                        .replace(")","")
                        .split(" ");
                    resultJSON[point.countrycode.value].push(
                        [
                            point.projectid.value,
                            coordinates[0],
                            coordinates[1],
                            point.objectiveId.value
                        ]
                    )
                }
                const gzip = pako.gzip(JSON.stringify(resultJSON));
                fs.mkdir('src/assets/data', { recursive: true }, (err) => {
                    fs.writeFile('src/assets/data/points.gzip', gzip, (err) => {
                        if (err) throw err;
                        console.log('INFO: File points.json is created successfully.');
                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}

new GenerateMapPoints().run();

