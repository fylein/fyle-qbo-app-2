import { defineConfig } from "cypress";
import environment from 'src/environments/environment.json';

export default defineConfig({
  projectId: 'ixtuem',
  e2e: {
    baseUrl: environment.app_url,
  },
  video: false,
  screenshotOnRunFailure: true,
  viewportHeight: 980,
  viewportWidth: 1440,
  defaultCommandTimeout: 10000
});
