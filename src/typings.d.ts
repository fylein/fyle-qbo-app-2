declare var $ENV: Env;

interface Env {
  PRODUCTION: string;
  FYLE_URL: string;
  FYLE_CLIENT_ID: string;
  CALLBACK_URI: string;
  API_URL: string;
  APP_URL: string;
  QBO_CLIENT_ID: string;
  QBO_SCOPE: string;
  QBO_AUTHORIZE_URL: string;
  QBO_APP_URL: string;
  HOTJAR_ID: string;
  SENTRY_DSN: string;
  RELEASE: string;
}