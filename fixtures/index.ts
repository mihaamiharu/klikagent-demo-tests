import { test as base } from '@playwright/test';

// POMs are added here as KlikAgent generates and reviews them.
// After each PR is merged, import the new POM and register it below.

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

export const personas = {
  admin: {
    email: 'admin@caresync.dev',
    password: 'Password123!',
    displayName: 'Admin',
    role: 'admin',
  },
  doctor: {
    email: 'dr.smith@caresync.dev',
    password: 'Password123!',
    displayName: 'Dr. Smith',
    role: 'doctor',
  },
  patient: {
    email: 'jane.doe@caresync.dev',
    password: 'Password123!',
    displayName: 'Jane',
    role: 'patient',
  },
} as const;

export type PersonaName = keyof typeof personas;
export type Persona = (typeof personas)[PersonaName];