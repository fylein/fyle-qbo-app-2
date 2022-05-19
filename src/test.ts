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
const user = environment.tests.user;

fetch(`${API_BASE_URL}/auth/refresh/`, {
  method: 'POST',
  body: JSON.stringify({ refresh_token: user.refresh_token }),
  headers: { 'Content-Type': 'application/json' }
}).then(result => result.json()).then(jsonformat => {
  const accessToken: {access_token: string} = {
    access_token: jsonformat.access_token,
  };
  fetch(`${API_BASE_URL}/user/profile/`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken.access_token}` }
  }).then(result => result.json()).then(jsonformat => {
    const profile:{access_token: string,org_id:string} = {
      org_id: jsonformat.data.org_id,
      access_token: accessToken.access_token
    };
    localStorage.setItem('user', JSON.stringify(profile));
  });
});
const context = require.context('./', true, /\.guard.spec|\.service.spec|.model.spec|.pipe.spec\.ts$/);
//const context = require.context('./', true, /\.guard.spec\.ts$/);
// And load the modules.
context.keys().map(context);
