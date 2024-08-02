import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { REQUEST, RESPONSE } from './src/express.tokens';
import { AppServerModule as bootstrap } from './src/main.server';


export function app(): express.Express {
  const server = express();
  // @ts-ignore
  // const distFolder = process.env.DIST_DIR || join(process.cwd(), '../dist/kohesio-frontend/browser');
  // const commonEngine = new CommonEngine();

  const distFolder = join(process.cwd(), 'dist/kohesio-frontend/browser');
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const url = `${protocol}://${headers.host}${originalUrl}`;
    const lang = originalUrl.split('/')[1] || 'en';
    const indexHtml = existsSync(join(distFolder, `${lang}/index.html`)) ? `${lang}/index.html` : 'en/index.html';
    commonEngine
      .render({
        bootstrap,
        documentFilePath: join(distFolder, indexHtml),
        url,
        publicPath: join(distFolder, `${lang}`),
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req },
          { provide: LOCALE_ID, useValue: lang },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default bootstrap;
