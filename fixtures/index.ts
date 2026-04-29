import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/auth/AuthPage';

type Fixtures = {
  authPage: AuthPage;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
});

export { expect } from '@playwright/test';