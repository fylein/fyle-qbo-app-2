const { writeFile } = require("fs");

const environment = {
  production: `${process.env.PRODUCTION}`,
  fyle_client_id: `${process.env.FYLE_CLIENT_ID}`,
  callback_uri: `${process.env.CALLBACK_URI}`,
  api_url: `${process.env.API_URL}`,
  app_url: `${process.env.APP_URL}`,
  qbo_client_id: `${process.env.QBO_CLIENT_ID}`,
  old_qbo_app_url: `${process.env.OLD_QBO_APP_URL}`,
  qbo_scope: `${process.env.QBO_SCOPE}`,
  qbo_authorize_uri: `${process.env.QBO_AUTHORIZE_URI}`,
  qbo_app_url: `${process.env.QBO_APP_URL}`,
  sentry_dsn: `${process.env.SENTRY_DSN}`,
  sentry_env: `${process.env.SENTRY_ENV}`,
  release: `${process.env.RELEASE}`,
  fyle_app_url: `${process.env.FYLE_APP_URL}`,
  tests: {
    user: {
      refresh_token: `${process.env.TESTS_USER_REFRESH_TOKEN}`,
    },
    workspaceId: `${process.env.TESTS_WORKSPACEID}`
  },
  refiner_survey: {
    onboarding_done_survery_id: `${process.env.REFINER_ONBOARDING_DONE_SURVEY_ID}`,
    export_done_survery_id: `${process.env.REFINER_EXPORT_DONE_SURVEY_ID}`
  }
};

const targetPath = './src/environments/environment.json';
writeFile(targetPath, JSON.stringify(environment), 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});
