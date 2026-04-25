import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('Patient can login with valid credentials and is redirected to dashboard', async ({ authPage }) => {
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await expect(authPage.page).toHaveURL(/\/dashboard$/);
      await authPage.expectWelcomeMessageWithFirstName(personas.patient.displayName);
      await authPage.expectSidebarShowsUserInfo(personas.patient.displayName, personas.patient.role);
    });

    test('Doctor can login with valid credentials and is redirected to doctor page', async ({ authPage }) => {
      await authPage.login(personas.doctor.email, personas.doctor.password);
      
      await expect(authPage.page).toHaveURL(/\/doctor$/);
      await authPage.expectWelcomeMessageWithFirstName(personas.doctor.displayName);
      await authPage.expectSidebarShowsUserInfo(personas.doctor.displayName, personas.doctor.role);
    });

    test('Admin can login with valid credentials and is redirected to admin page', async ({ authPage }) => {
      await authPage.login(personas.admin.email, personas.admin.password);
      
      await expect(authPage.page).toHaveURL(/\/admin$/);
      await authPage.expectWelcomeMessageWithFirstName(personas.admin.displayName);
      await authPage.expectSidebarShowsUserInfo(personas.admin.displayName, personas.admin.role);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error message when password is wrong', async ({ authPage }) => {
      await authPage.login(personas.patient.email, 'wrongpassword');
      
      await authPage.expectOnLoginPage();
      await authPage.expectErrorMessage('Invalid email or password');
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });

    test('shows error message when email does not exist', async ({ authPage }) => {
      await authPage.login('nonexistent@test.com', personas.patient.password);
      
      await authPage.expectOnLoginPage();
      await authPage.expectErrorMessage('Invalid email or password');
      await expect(authPage.emailInput).toHaveValue('nonexistent@test.com');
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('shows validation errors on both fields when both are empty', async ({ authPage }) => {
      await authPage.signInButton.click();
      
      await authPage.expectOnLoginPage();
      await authPage.expectEmailValidationError();
      await authPage.expectPasswordValidationError();
    });

    test('shows password validation error when only email is filled', async ({ authPage }) => {
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.signInButton.click();
      
      await authPage.expectOnLoginPage();
      await authPage.expectPasswordValidationError();
    });

    test('shows email validation error when only password is filled', async ({ authPage }) => {
      await authPage.passwordInput.fill(personas.patient.password);
      await authPage.signInButton.click();
      
      await authPage.expectOnLoginPage();
      await authPage.expectEmailValidationError();
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated user can logout and is redirected to login', async ({ authPage }) => {
      // Login first
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(authPage.page).toHaveURL(/\/dashboard$/);
      
      // Logout
      await authPage.logout();
      await authPage.expectOnLoginPage();
    });
  });

  test.describe('Role-based redirect', { tag: '@regression' }, () => {
    test('unauthenticated user accessing dashboard is redirected to login', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login$/);
    });

    test('each role is redirected to their specific page after login', async ({ authPage }) => {
      // Patient → /dashboard
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(authPage.page).toHaveURL(/\/dashboard$/);
      
      await authPage.logout();
      await authPage.expectOnLoginPage();
      
      // Doctor → /doctor
      await authPage.login(personas.doctor.email, personas.doctor.password);
      await expect(authPage.page).toHaveURL(/\/doctor$/);
      
      await authPage.logout();
      await authPage.expectOnLoginPage();
      
      // Admin → /admin
      await authPage.login(personas.admin.email, personas.admin.password);
      await expect(authPage.page).toHaveURL(/\/admin$/);
    });
  });
});