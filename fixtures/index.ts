import { test as base, Page } from '@playwright/test';
import { AuthPage } from '../pages/auth/AuthPage';

// POMs are added here as KlikAgent generates and reviews them.
// After each PR is merged, import the new POM and register it below.

type Fixtures = {
  // Auth — use for login-page tests (form validation, error states, etc.)
  authPage: AuthPage;

  // Persona fixtures — provide a pre-authenticated Page via storageState.
  // Use these in feature tests instead of beforeEach login:
  //   test('...', async ({ asPatient }) => { await asPatient.goto('/dashboard'); ... })
  asPatient: Page;
  asDoctor: Page;
  asAdmin: Page;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  asPatient: async ({ browser }, use) => {
    const ctx = await browser.newContext({ storageState: '.playwright-auth/patient.json' });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },

  asDoctor: async ({ browser }, use) => {
    const ctx = await browser.newContext({ storageState: '.playwright-auth/doctor.json' });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },

  asAdmin: async ({ browser }, use) => {
    const ctx = await browser.newContext({ storageState: '.playwright-auth/admin.json' });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

export { expect } from '@playwright/test';