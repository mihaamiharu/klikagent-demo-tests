import { chromium, FullConfig } from '@playwright/test';
import { personas } from './config/personas';
import fs from 'fs';
import path from 'path';

/**
 * Global setup — runs once before the entire test suite.
 * Logs in as each persona and saves storageState to .playwright-auth/{persona}.json.
 * Tests load the saved state via asPatient / asDoctor / asAdmin fixtures — no login boilerplate needed.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'https://app.testingwithekki.com';
  const authDir = path.join(process.cwd(), '.playwright-auth');
  fs.mkdirSync(authDir, { recursive: true });

  const browser = await chromium.launch();

  for (const [name, persona] of Object.entries(personas)) {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    await page.goto('/login');
    await page.getByTestId('email-input').fill(persona.email);
    await page.getByTestId('password-input').fill(persona.password);
    await page.getByTestId('login-submit').click();
    await page.waitForURL(/\/dashboard/);

    const stateFile = path.join(authDir, `${name}.json`);
    await context.storageState({ path: stateFile });
    await context.close();
  }

  await browser.close();
}
