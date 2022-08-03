import { defineConfig } from "cypress";
import { environment } from "src/environments/environment";

export default defineConfig({
  projectId: 'ixtuem',
  e2e: {
    baseUrl: environment.cypress_env === 'Local' ? 'http://localhost:4200' : 'https://quickbooks-new.fyleapps.tech',
  },
  video: false,
  screenshotOnRunFailure: false
});
