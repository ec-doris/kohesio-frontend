import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync } from 'fs';
import {ConfigService} from "@nestjs/config";
import * as sessionActive from 'express-session';
import * as sessionInactive from 'express-session';
import * as passport from "passport";
import helmet from 'helmet';
import RedisStore from "connect-redis"
import {createClient} from "redis";
import * as cookieParser from 'cookie-parser';
import {RequestMethod} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const languages = ["bg","cs","da","de","el","es","et","fi","fr","ga","hr",
  "hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv","en"];

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: /\.europa\.eu$/
  });
  app.use(helmet());

  const configService:ConfigService<environmentVARS> = app.get(ConfigService);
  const environment = configService.get<string>('ENV');
  console.log("ENV=",environment);

  // Initialize client.
  let redisClient = createClient({
    socket: {
      host: configService.get<string>('REDIS_HOST'),
      connectTimeout: 50000
    },
    password: configService.get<string>('REDIS_PASSWORD')
  })
  redisClient.connect().catch(console.error)

  // Initialize store.
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "kohesio_session:"
  })

 const sessionConfig = {
    secret: configService.get<string>('SESSION_SECRET'),
    store: redisStore,
    resave: false,
    rolling: true,
    saveUninitialized: true,
    name: "kohesio.sid",
    cookie: {
      secure: true,
      maxAge: (60000 * 60) * 2 //2 hours
    }
  };

  const sessionObj = {
    active: sessionActive(sessionConfig),
    inactive: sessionInactive(Object.assign({}, sessionConfig, { rolling: false }))
  };

  app.getHttpAdapter().getInstance().set('trust proxy', 1)

  app.use((req, res, next) => {
    if (req.path === '/api/user') {
      sessionObj.inactive(req, res, next);
    }else{
      sessionObj.active(req, res, next);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  //If is not production let's redirect everything to /login if there is no user info in the session
  if (environment != 'local' && environment != 'production') {
    app.getHttpAdapter().getInstance().all('*', (req, res, next) => {
      //console.log("PATH",req.path);
      //console.log("USER", req.user);
      //console.log("SESSION", req.session);
      //console.log("REQ", req);
      if (req.user || req.path == '/api/login' || req.path == '/api/loginCallback') {
        next();
      }else{
        const callback = req.path ? req.path : '/';
        res.redirect("/api/login?callback="+callback);
      }
    });
  }

  if (environment != "local") {
    for (let lang of languages) {
      const subApp = await getTranslatedServer(lang);
      if (subApp) {
        //console.log("LANG=",lang);
        app.getHttpAdapter().getInstance().use("/" + lang, subApp);
      }
    }
  }
  app.setGlobalPrefix('api',{
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  setupSwagger(app);
  const port = configService.get<number>('NODE_PORT');
  await app.listen(port);
}

async function getTranslatedServer(lang) {
  const file = `/app/dist/kohesio-frontend/server/${lang}/main.js`;
  if (existsSync(file)) {
    const server = await import(file);
    const serverApp = server.app(lang,'/app/');
    //console.log("SERVERAPP",serverApp);
    return serverApp;
  }
};

function setupSwagger(app){
  const config = new DocumentBuilder()
    .setTitle('Kohesio API')
    .setDescription('Kohesio API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
