// activated by running :
// npm run build -- --configuration=dev
// OR
// npm run build-dev

export const environment = {
    production: false,
    enableDevToolRedux: true,
    sparqlBaseUrl: 'https://query.linkedopendata.eu/bigdata/namespace/wdq/sparql',
    fullTextSearchUrl: 'https://qanswer-core1.univ-st-etienne.fr/api/endpoint/eu/sparql?user=Max'
};
