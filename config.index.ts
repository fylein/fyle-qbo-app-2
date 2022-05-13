import { writeFile } from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
  production: false,
  fyle_url: '${process.env.SECRETS_FYLE_URL}',
  fyle_client_id: '${process.env.SECRETS_FYLE_CLIENT_ID}',
  callback_uri: '${process.env.SECRETS_CALLBACK_URL}',
  api_url: '${process.env.SECRETS_API_URL}',
  app_url: '${process.env.SECRETS_APP_URL}',
  qbo_client_id: '${process.env.SECRETS_QBO_CLIENT_ID}',
  qbo_scope: '${process.env.SECRETS_QBO_SCOPE}',
  qbo_authorize_uri: '${process.env.SECRETS_QBO_AUTHORIZE_URI}',
  qbo_app_url: '${process.env.SECRETS_QBO_APP_URL}',
  hotjar_id: '${process.env.SECRETS_HOTJAR_ID}',
  sentry_dsn: '${process.env.SECRETS_SENTRY_DSN}',
  release: '${process.env.SECRETS_RELEASE}',
  fyle_app_url: '${process.env.SECRETS_FYLE_APP_URL}',
  tests: {
    user: {
      refresh_token: '${process.env.SECRETS_TESTS_USER_REFRESH_TOKEN}',
    },
    workspaceId: '${process.env.SECRETS_TESTS_WORKSPACEID}'
  }
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
