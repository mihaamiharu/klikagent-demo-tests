import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AuthPage } from '../pages/auth/AuthPage';

type Fixtures = {
  authPage: AuthPage;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }: { page: Page }, use: (authPage: AuthPage) => Promise<void>) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },
});

export { expect } from '@playwright/test';