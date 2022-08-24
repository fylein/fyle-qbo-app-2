import { defineConfig } from "cypress";
import environment from 'src/environments/environment.json';

export default defineConfig({
  projectId: 'ixtuem',
  e2e: {
    baseUrl: environment.app_url,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    }
  },
  env: {
    coverage: true
  },
  screenshotOnRunFailure: true,
  videoUploadOnPasses: false,
  viewportHeight: 980,
  viewportWidth: 1440,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000
});
