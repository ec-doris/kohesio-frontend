const express = require("express");
const path = require("path");
const langs = ["bg","cs","da","de","el","es","et","fi","fr","ga","hr",
  "hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv","en"];

const getTranslatedServer = (lang) => {
  const distFolder = path.join(
    process.cwd(),
    `dist/kohesio-frontend/server/${lang}`
  );
  const server = require(`${distFolder}/main.js`);
  return server.app(lang);
};

function run() {
  const port = process.env.PORT || 80;

  let apps = [];

  for(let lang of langs){
    let app = getTranslatedServer(lang);
    apps.push({
      app: app,
      lang: lang
    });
  }
  const server = express();

  for(let app of apps){
    server.use("/" + app.lang, app.app);
    if (app.lang == 'en'){
      server.use("", app.app);
    }
  }

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
