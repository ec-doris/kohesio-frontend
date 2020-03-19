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
    }
};
