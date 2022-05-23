import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from '@sentry/angular';
import { Integrations as TracingIntegrations } from '@sentry/tracing';

const hostname = window.location.hostname;
const env = environment.sentry_env;

if (environment.sentry_dsn && env) {
  Sentry.init({
    dsn: environment.sentry_dsn,
    release: env,
    environment: env,
    // TODO: add safety 400 to this list
    ignoreErrors: [
      'Non-Error exception captured'
    ],
    integrations: [new TracingIntegrations.BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    })],
    // TODO: decrease the sample rate to 0.1 later
    tracesSampleRate: 1
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
