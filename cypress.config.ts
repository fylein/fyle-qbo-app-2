import { defineConfig } from "cypress";
import environment from 'src/environments/environment.json';

export default defineConfig({
  projectId: 'ixtuem',
  e2e: {
    baseUrl: environment.app_url,
  },
  video: false,
  screenshotOnRunFailure: false
});