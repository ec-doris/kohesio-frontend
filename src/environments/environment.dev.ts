// activated by running :
// npm run build -- --configuration=dev
// OR
// npm run build-dev

export const environment = {
    production: false,
    enableDevToolRedux: true,
    configPath: "assets/config/config.dev.json",
    api: 'https://dev.kohesio.linkedopendata.eu/api/facet/eu',
    entityURL: 'https://linkedopendata.eu/entity/'
};
