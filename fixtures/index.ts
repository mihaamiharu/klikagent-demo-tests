import { AuthPage } from '../pages/auth/AuthPage';
import { BookAppointmentPage } from '../pages/book-appointment/BookAppointmentPage';
import { test as base } from '@playwright/test';

// POMs are added here as KlikAgent generates and reviews them.
// After each PR is merged, import the new POM and register it below.

type Fixtures = {
  authPage: AuthPage;
  bookAppointmentPage: BookAppointmentPage;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  bookAppointmentPage: async ({ page }, use) => {
    await use(new BookAppointmentPage(page));
  },
});

export { expect } from '@playwright/test';