import { test, expect, personas } from '../../../fixtures';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.navigateToLogin();
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient can login and is redirected to dashboard with welcome message', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await authPage.expectLoginSuccess();
      await expect(authPage.page.getByText('Jane Doe')).toBeVisible();
      await expect(authPage.page.getByText('patient')).toBeVisible();
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error and no redirect with wrong password', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'WrongPassword123');
      
      await authPage.expectLoginError();
      await authPage.expectOnLoginPage();
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('shows error and no redirect with non-existent email', async ({ authPage }) => {
      await authPage.login('nonexistent@example.com', personas.patient.password);
      
      await authPage.expectLoginError();
      await authPage.expectOnLoginPage();
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('shows validation errors on both fields when both are empty', async ({ authPage }) => {
      await authPage.signInButton.click();
      
      await authPage.expectEmailValidationError();
      await authPage.expectPasswordValidationError();
    });

    test('shows password error when only email is filled', async ({ authPage }) => {
      await authPage.emailInput.fill('test@example.com');
      await authPage.signInButton.click();
      
      await authPage.expectPasswordValidationError();
    });

    test('shows email error when only password is filled', async ({ authPage }) => {
      await authPage.passwordInput.fill('Password123!');
      await authPage.signInButton.click();
      
      await authPage.expectEmailValidationError();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated user can logout and is redirected to login', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectLoginSuccess();
      
      await authPage.clickLogout();
      
      await authPage.expectOnLoginPage();
    });

    test('navigating to dashboard while logged out redirects to login', async ({ authPage, page }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.expectLoginSuccess();
      
      await authPage.clickLogout();
      await authPage.expectOnLoginPage();
      
      await page.goto('/dashboard');
      
      await authPage.expectOnLoginPage();
    });
  });

  test.describe('Role-based redirect', { tag: '@smoke' }, () => {
    test('admin is redirected to /admin after login', async ({ authPage, page }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      
      await expect(page).toHaveURL(/\/admin/);
      await expect(page.getByText('Admin User')).toBeVisible();
      await expect(page.getByText('admin')).toBeVisible();
    });

    test('doctor is redirected to /doctor after login', async ({ authPage, page }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);
      
      await expect(page).toHaveURL(/\/doctor/);
      await expect(page.getByText('John Smith')).toBeVisible();
      await expect(page.getByText('doctor')).toBeVisible();
    });

    test('patient is redirected to /dashboard after login', async ({ authPage, page }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.getByText('Jane Doe')).toBeVisible();
      await expect(page.getByText('patient')).toBeVisible();
    });
  });
});
