import { writeFile } from 'fs';

const targetPath = './src/environments/environment.ts';

const envConfigFile = `export const environment = {
  production: false,
  fyle_url: '${process.env.FYLE_URL}',
  fyle_client_id: '${process.env.FYLE_CLIENT_ID}',
  callback_uri: '${process.env.CALLBACK_URL}',
  api_url: '${process.env.API_URL}',
  app_url: '${process.env.APP_URL}',
  qbo_client_id: '${process.env.QBO_CLIENT_ID}',
  old_qbo_app_url: '${process.env.OLD_QBO_APP_URL}',
  qbo_scope: '${process.env.QBO_SCOPE}',
  qbo_authorize_uri: '${process.env.QBO_AUTHORIZE_URI}',
  qbo_app_url: '${process.env.QBO_APP_URL}',
  hotjar_id: '${process.env.HOTJAR_ID}',
  sentry_dsn: '${process.env.SENTRY_DSN}',
  release: '${process.env.RELEASE}',
  fyle_app_url: '${process.env.FYLE_APP_URL}',
  tests: {
    user: {
      refresh_token: '${process.env.TESTS_USER_REFRESH_TOKEN}',
    },
    workspaceId: '${process.env.TESTS_WORKSPACEID}'
  }
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
