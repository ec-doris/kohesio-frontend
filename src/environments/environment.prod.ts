// activated by running :
// npm run build -- --configuration=production
// OR
// npm run build-prod

export const environment = {
    production: true,
    enableDevToolRedux: false,
    configPath: "assets/config/config.prod.json",
    entityURL: 'https://linkedopendata.eu/entity/'
};
