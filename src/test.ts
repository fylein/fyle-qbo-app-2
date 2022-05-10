// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { environment } from 'src/environments/environment';
const API_BASE_URL = environment.api_url
declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};
// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
// Then we find all the tests.
  localStorage.setItem('workspaceId', environment.tests.workspaceId);
  localStorage.setItem('orgsCount', '1');
  localStorage.setItem('user',environment.tests.user)
  let user = JSON.parse(environment.tests.user);
  fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    body: JSON.stringify({ refresh_token: user.refresh_token }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(result => result.json())
    .then(jsonformat => {
      user.access_token = jsonformat.access_token;
      user = JSON.stringify(user);
      localStorage.setItem('user', user);
    });
const context = require.context('./', true, /\.service.spec|.model.spec|.pipe.spec\.ts$/);
// And load the modules.
context.keys().map(context);
