// activated by running :
// npm run build -- --configuration=production
// OR
// npm run build-prod

export const environment = {
    production: true,
    enableDevToolRedux: false,
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
