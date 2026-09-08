import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: [
    {
      command: 'npm run start:dev',
      cwd: '../backend',
      url: 'http://localhost:4000/graphql',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        PORT: '4000',
        POKEAPI_BASE_URL: 'https://pokeapi.co/api/v2',
      },
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        GRAPHQL_URL: 'http://localhost:4000/graphql',
      },
    },
  ],
});
