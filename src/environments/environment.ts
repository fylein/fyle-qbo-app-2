// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: '{{PRODUCTION}}',
  fyle_url: '{{FYLE_URL}}',
  fyle_client_id: '{{FYLE_CLIENT_ID}}',
  callback_uri: '{{CALLBACK_URI}}',
  api_url: '{{API_URL}}',
  app_url: '{{APP_URL}}',
  old_qbo_app_url: '{{OLD_QBO_APP_URL}}',
  qbo_client_id: '{{QBO_CLIENT_ID}}',
  qbo_scope: '{{QBO_SCOPE}}',
  qbo_authorize_uri: '{{QBO_AUTHORIZE_URI}}',
  qbo_app_url: '{{QBO_APP_URL}}',
  hotjar_id : '{{HOTJAR_ID}}',
  sentry_dsn: '{{SENTRY_DSN}}',
  sentry_env: '{{SENTRY_ENV}}',
  release: '{{RELEASE}}',
  fyle_app_url: '{{FYLE_APP_URL}}',
  clarity_project_id: '{{CLARITY_PROJECT_ID}}',
  tests:{
    workspaceId: '{{TEST_WORKSPACE_ID}}',
    user: {
      refresh_token: '{{TEST_REFRESH_TOKEN}}'
    }
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
