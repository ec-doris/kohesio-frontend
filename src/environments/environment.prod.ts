// activated by running :
// npm run build -- --configuration=production
// OR
// npm run build-prod

export const environment = {
    production: true,
    enableDevToolRedux: false,
    configPath: "assets/config/config.prod.json",
    modules: {
        // CORE
        core: {
            api: {
                base: '',
            },
        },
    },
    api: 'https://kohesio.linkedopendata.eu/api/facet/eu',
    entityURL: 'https://linkedopendata.eu/entity/'
};
