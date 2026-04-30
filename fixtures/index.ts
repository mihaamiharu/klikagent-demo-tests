import { AuthPage } from '../pages/auth/AuthPage';
import { test as base } from '@playwright/test';

// POMs are added here as KlikAgent generates and reviews them.
// After each PR is merged, import the new POM and register it below.

type Fixtures = {
  authPage: AuthPage;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
});

export { expect } from '@playwright/test';
