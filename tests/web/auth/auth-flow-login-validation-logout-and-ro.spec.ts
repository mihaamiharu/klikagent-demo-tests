import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {

  // ========================================
  // Login — Valid Credentials
  // ========================================
  test.describe('Login — valid credentials', { tag: ['@smoke', '@auth'] }, () => {
    test('Patient is redirected to dashboard and sees welcome message with first name', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await expect(page).toHaveURL('/dashboard');
      await authPage.expectWelcomeMessageWithFirstName('Jane');
      await authPage.expectSidebarUserInfo('Jane Doe', 'patient');
    });

    test('Admin is redirected to admin dashboard', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.admin.email, personas.admin.password);
      
      await expect(page).toHaveURL('/admin');
      await authPage.expectAdminDashboardHeadingVisible();
      await authPage.expectSidebarUserInfo(personas.admin.name, personas.admin.role);
    });

    test('Doctor can log in successfully', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.doctor.email, personas.doctor.password);
      
      await expect(page).toHaveURL(/\/dashboard|\/admin/);
      await authPage.expectWelcomeMessageWithFirstName('Dr.');
    });
  });

  // ========================================
  // Login — Invalid Credentials
  // ========================================
  test.describe('Login — invalid credentials', { tag: ['@regression', '@auth'] }, () => {
    test('shows error message and does not redirect when password is wrong', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, 'WrongPassword123!');
      
      await authPage.expectLoginError();
      await authPage.expectErrorMessageContains('Invalid email or password');
    });

    test('shows error message and does not redirect for non-existent email', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login('nonexistent@example.com', 'Password123!');
      
      await authPage.expectLoginError();
      await authPage.expectErrorMessageContains('Invalid email or password');
    });

    test('email field retains its value after failed attempt', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      const testEmail = 'nonexistent@example.com';
      await authPage.login(testEmail, 'WrongPassword123!');
      
      await authPage.expectLoginError();
      await authPage.expectEmailRetained(testEmail);
    });

    test('password field is cleared after failed attempt', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, 'WrongPassword123!');
      
      await authPage.expectLoginError();
      await authPage.expectPasswordCleared();
    });
  });

  // ========================================
  // Login — Empty Fields Validation
  // ========================================
  test.describe('Login — empty fields validation', { tag: ['@regression', '@auth'] }, () => {
    test('shows validation errors on both fields when both are empty', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.clearEmailInput();
      await authPage.clearPasswordInput();
      await authPage.clickSignInButton();
      
      await authPage.expectBothValidationErrorsVisible();
    });

    test('shows password validation error when only email is filled', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.clearPasswordInput();
      await authPage.clickSignInButton();
      
      await authPage.expectPasswordRequiredErrorVisible();
    });

    test('shows email validation error when only password is filled', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.clearEmailInput();
      await authPage.passwordInput.fill('Password123!');
      await authPage.clickSignInButton();
      
      await authPage.expectEmailRequiredErrorVisible();
    });

    test('shows password validation error when password is less than 6 characters', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.emailInput.fill(personas.patient.email);
      await authPage.passwordInput.fill('12345');
      await authPage.clickSignInButton();
      
      await authPage.expectPasswordValidationError();
    });
  });

  // ========================================
  // Logout
  // ========================================
  test.describe('Logout', { tag: ['@smoke', '@auth'] }, () => {
    test('authenticated user can log out and is redirected to login', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await expect(page).toHaveURL('/dashboard');
      
      await authPage.logout();
      
      await expect(page).toHaveURL(/\/login/);
      await authPage.expectCareSyncHeadingVisible();
    });

    test('navigating to dashboard while logged out redirects to login', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await authPage.logout();
      
      await expect(page).toHaveURL(/\/login/);
      await page.goto('/dashboard');
      
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // ========================================
  // Role-Based Redirect
  // ========================================
  test.describe('Role-based redirect', { tag: ['@smoke', '@auth'] }, () => {
    test('patient is redirected to /dashboard after login', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await expect(page).toHaveURL('/dashboard');
    });

    test('admin is redirected to /admin after login', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.admin.email, personas.admin.password);
      
      await expect(page).toHaveURL('/admin');
    });

    test('patient navigating to /admin is redirected to login', async ({ page, authPage }) => {
      await authPage.navigateToLogin();
      await authPage.login(personas.patient.email, personas.patient.password);
      await page.goto('/admin');
      
      await expect(page).toHaveURL(/\/login/);
    });
  });
});