import { defineConfig } from "cypress";
import environment from 'src/environments/environment.json';

export default defineConfig({
  projectId: 'ixtuem',
  e2e: {
    baseUrl: environment.app_url,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    }
  },
  viewportHeight: 980,
  viewportWidth: 1440,
  defaultCommandTimeout: environment.e2e_tests.env !== 'staging' ? 15000 : 30000,
  requestTimeout: environment.e2e_tests.env !== 'staging' ? 15000 : 30000
});
