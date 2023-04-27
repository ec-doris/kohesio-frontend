interface environmentVARS {
  SESSION_SECRET: string;
  ENV: string;
  OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER:string;
  OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID:string;
  OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET:string;
  OAUTH2_CLIENT_REGISTRATION_LOGIN_SCOPE:string;
  OAUTH2_CLIENT_REGISTRATION_LOGIN_REDIRECT_URI:string;
  OAUTH2_CLIENT_REGISTRATION_LOGIN_POST_LOGOUT_REDIRECT_URI:string;
  OAUTH2_TOKEN_ENDPOINT_AUTH_METHOD:string;
  OAUTH2_ID_TOKEN_SIGNED_RESPONSE_ALG:string;
  DB_HOST:string;
  DB_PORT:number;
  DB_USERNAME:string;
  DB_PASSWORD:string;
  DB_DATABASE:string;
  BACKEND_WIKI_HOST:string;
  REDIS_HOST:string;
  REDIS_PASSWORD:string;
}
