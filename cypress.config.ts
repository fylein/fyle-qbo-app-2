import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'ixtuem',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
