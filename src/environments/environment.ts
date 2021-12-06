// used by serve / when no configuration is provided on the build script
// run npm run build

export const environment = {
    production: false,
    enableDevToolRedux: true,
    configPath: "assets/config/config.json",
    api: 'https://dev.kohesio.linkedopendata.eu/api/facet/eu',
    entityURL: 'https://linkedopendata.eu/entity/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
