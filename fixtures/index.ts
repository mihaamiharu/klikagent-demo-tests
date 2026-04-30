import { AuthPage } from '../pages/auth/AuthPage';
import { DashboardPage } from '../pages/book-appointment/DashboardPage';
import { test as base } from '@playwright/test';

// POMs are added here as KlikAgent generates and reviews them.
// After each PR is merged, import the new POM and register it below.

type Fixtures = {
  authPage: AuthPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';