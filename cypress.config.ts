import { defineConfig } from "cypress";
import environment from 'src/environments/environment.json';

export default defineConfig({
  projectId: 'ixtuem',
  e2e: {
    baseUrl: environment.app_url,
  },
  screenshotOnRunFailure: true,
  videoUploadOnPasses: false,
  viewportHeight: 980,
  viewportWidth: 1440,
  defaultCommandTimeout: environment.e2e_tests.env === 'Local' ? 6000: 60000
});
