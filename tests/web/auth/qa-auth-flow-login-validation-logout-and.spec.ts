import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.gotoLogin();
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient logs in and is redirected to dashboard with welcome message', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);

      // User is redirected to /dashboard
      await authPage.expectUrl(/\/dashboard/);

      // Welcome heading shows dynamic first name
      await authPage.welcomeHeading(personas.patient.firstName).waitFor({ state: 'visible' });

      // Sidebar shows user's full name and role
      await expect(authPage.sidebar.getByText(personas.patient.displayName)).toBeVisible();
      await expect(authPage.sidebar.getByText(personas.patient.role)).toBeVisible();
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('wrong password shows error and stays on login page', async ({ authPage }) => {
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.passwordInput.fill('wrongPassword123');
      await authPage.signInButton.click();

      // Error message is shown
      await authPage.expectInvalidCredentialsError();

      // User stays on /login
      await authPage.expectUrl(/\/login/);

      // Email field retains its value
      await authPage.expectEmailValue(personas.patient.email);
    });

    test('non-existent email shows error and stays on login page', async ({ authPage }) => {
      await authPage.login('nonexistent@example.com', 'wrongpassword');

      // Error message is shown
      await authPage.expectInvalidCredentialsError();

      // User stays on /login
      await authPage.expectUrl(/\/login/);

      // Email field retains its value
      await authPage.expectEmailValue('nonexistent@example.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('both fields empty shows both validation errors', async ({ authPage }) => {
      await authPage.clearEmail();
      await authPage.clearPassword();
      await authPage.signInButton.click();

      // Both validation errors appear
      await authPage.expectEmailValidationError();
      await authPage.expectPasswordValidationError();

      // User stays on /login
      await authPage.expectUrl(/\/login/);
    });

    test('only email filled shows password validation error', async ({ authPage }) => {
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.clearPassword();
      await authPage.signInButton.click();

      // Password validation error appears
      await authPage.expectPasswordValidationError();

      // Email field retains its value
      await authPage.expectEmailValue(personas.patient.email);

      // User stays on /login
      await authPage.expectUrl(/\/login/);
    });

    test('only password filled shows email validation error', async ({ authPage }) => {
      await authPage.clearEmail();
      await authPage.passwordInput.fill('Password123!');
      await authPage.signInButton.click();

      // Email validation error appears
      await authPage.expectEmailValidationError();

      // User stays on /login
      await authPage.expectUrl(/\/login/);
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated patient clicks logout and is redirected to login', async ({ authPage }) => {
      // Login first
      await authPage.loginAs(personas.patient);
      await authPage.expectUrl(/\/dashboard/);

      // Click logout
      await authPage.logout();

      // User is redirected to /login
      await authPage.expectUrl(/\/login/);
    });

    test('navigating to dashboard while logged out redirects to login', async ({ authPage }) => {
      // Ensure user is on login page (not authenticated)
      await authPage.gotoLogin();

      // Navigate directly to /dashboard
      await authPage.goto('/dashboard');

      // User is redirected to /login
      await authPage.expectUrl(/\/login/);
    });
  });

  test.describe('Role-based redirect', { tag: '@smoke' }, () => {
    test(`${personas.admin.role} is redirected to /${personas.admin.route} after login`, async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);

      // User is redirected to their role route
      await authPage.expectUrl(new RegExp(`/${personas.admin.route}/`));

      // Role-specific heading is visible
      await authPage.roleHeading(personas.admin.role).waitFor({ state: 'visible' });

      // Sidebar shows user's full name and role
      await expect(authPage.sidebar.getByText(personas.admin.displayName)).toBeVisible();
      await expect(authPage.sidebar.getByText(personas.admin.role)).toBeVisible();
    });

    test(`${personas.doctor.role} is redirected to /${personas.doctor.route} after login`, async ({ authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);

      // User is redirected to their role route
      await authPage.expectUrl(new RegExp(`/${personas.doctor.route}/`));

      // Role-specific heading is visible
      await authPage.roleHeading(personas.doctor.role).waitFor({ state: 'visible' });

      // Sidebar shows user's full name and role
      await expect(authPage.sidebar.getByText(personas.doctor.displayName)).toBeVisible();
      await expect(authPage.sidebar.getByText(personas.doctor.role)).toBeVisible();
    });

    test(`${personas.patient.role} is redirected to /${personas.patient.route} after login`, async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);

      // User is redirected to their role route
      await authPage.expectUrl(new RegExp(`/${personas.patient.route}/`));

      // Role-specific heading is visible
      await authPage.roleHeading(personas.patient.role).waitFor({ state: 'visible' });
    });
  });
});

test.describe('Auth | Missing locators', { tag: '@auth' }, () => {
  test.skip('register link navigation', async () => {
    // SKIPPED: register-link was not observed during exploration — no route to test registration flow
  });
});