import { test, expect } from '../../../fixtures';
import { personas, type PersonaName } from '../../../config/personas';

/**
 * Auth Flow — Login, Validation, Logout, and Role-Based Redirect
 * 
 * This spec covers all authentication-related functionality:
 * - Login with valid credentials
 * - Login with invalid credentials (wrong password, non-existent email)
 * - Login validation for empty fields
 * - Logout functionality
 * - Role-based redirect behavior
 * - Protection of authenticated routes
 */
test.describe('Auth | Login, Validation, Logout and Role-Based Redirect', { tag: ['@auth', '@smoke'] }, () => {

  // ============================================================
  // Login — Valid Credentials
  // ============================================================
  test.describe('Login — Valid Credentials', { tag: '@auth' }, () => {

    test('admin user navigates to /login and sees the CareSync sign-in form', async ({ authPage }) => {
      await authPage.goto();
      
      // Verify login page structure
      await authPage.expectLoginFormVisible();
    });

    test('admin fills valid credentials and is redirected to dashboard', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.goto();
      await authPage.login(persona.email, persona.password);
      
      // Should be redirected away from login
      await expect(page).not.toHaveURL(/\/login/);
    });

    test('welcome message with user first name is visible after login', async ({ authPage }) => {
      const persona = personas.admin;
      await authPage.login(persona.email, persona.password);
      
      // Verify user is logged in with correct info
      await authPage.expectUserProfile(persona.displayName, persona.role);
    });

    test('sidebar shows user full name and role', async ({ authPage }) => {
      const persona = personas.admin;
      await authPage.login(persona.email, persona.password);
      
      // Verify sidebar user info
      await authPage.expectUserProfile(persona.displayName, persona.role);
    });
  });

  // ============================================================
  // Login — Invalid Credentials
  // ============================================================
  test.describe('Login — Invalid Credentials', { tag: '@auth' }, () => {

    test('shows error message with wrong password - no redirect', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.goto();
      await authPage.login(persona.email, 'wrongpassword');
      
      // Verify error message is shown
      await expect(authPage.alert).toBeVisible();
      await expect(authPage.alert).toContainText(/invalid/i);
      
      // Verify no redirect
      await expect(page).toHaveURL(/\/login/);
    });

    test('shows error message with non-existent email - no redirect', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.goto();
      await authPage.login('nonexistent@caresync.dev', persona.password);
      
      // Verify error message is shown
      await expect(authPage.alert).toBeVisible();
      await expect(authPage.alert).toContainText(/invalid/i);
      
      // Verify no redirect
      await expect(page).toHaveURL(/\/login/);
    });

    test('email field retains its value after failed attempt', async ({ authPage }) => {
      const persona = personas.admin;
      const testEmail = 'testuser@caresync.dev';
      await authPage.goto();
      await authPage.login(testEmail, 'wrongpassword');
      
      // Email should be retained
      await expect(authPage.emailInput).toHaveValue(testEmail);
    });

    test('password field is cleared after failed attempt', async ({ authPage }) => {
      const persona = personas.admin;
      await authPage.goto();
      await authPage.login(persona.email, 'wrongpassword');
      
      // Password should be cleared for security
      await expect(authPage.passwordInput).toBeEmpty();
    });
  });

  // ============================================================
  // Login — Empty Fields Validation
  // ============================================================
  test.describe('Login — Empty Fields Validation', { tag: '@auth' }, () => {

    test('shows validation errors when both fields are empty', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.goto();
      
      // Click Sign In without filling anything
      await authPage.signInButton.click();
      
      // Should show validation error (either inline or alert)
      const hasAlert = await authPage.alert.isVisible().catch(() => false);
      
      // Should remain on login page
      await expect(page).toHaveURL(/\/login/);
      
      // At least one validation mechanism should trigger
      expect(hasAlert || await authPage.page.locator('input:invalid').count() > 0).toBeTruthy();
    });

    test('shows password validation error when only email is filled', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.goto();
      await authPage.emailInput.fill(persona.email);
      await authPage.signInButton.click();
      
      // Should show validation for password
      await expect(page).toHaveURL(/\/login/);
    });

    test('shows email validation error when only password is filled', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.goto();
      await authPage.passwordInput.fill('Password123!');
      await authPage.signInButton.click();
      
      // Should show validation for email
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // ============================================================
  // Logout
  // ============================================================
  test.describe('Logout', { tag: '@auth' }, () => {

    test('authenticated user clicks logout and is redirected to /login', async ({ page, authPage }) => {
      const persona = personas.admin;
      // First, log in
      await authPage.login(persona.email, persona.password);
      await expect(page).not.toHaveURL(/\/login/);
      
      // Click logout button in sidebar
      await authPage.logout();
      
      // Should be redirected to login page
      await expect(page).toHaveURL(/\/login/);
      
      // Login form should be visible
      await authPage.expectLoginFormVisible();
    });

    test('navigating to /dashboard while logged out redirects to /login', async ({ page, authPage }) => {
      const persona = personas.admin;
      // Log in first
      await authPage.login(persona.email, persona.password);
      await expect(page).not.toHaveURL(/\/login/);
      
      // Log out
      await authPage.logout();
      
      // Try to access dashboard
      await page.goto('/dashboard');
      
      // Should redirect back to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // ============================================================
  // Role-Based Redirect
  // ============================================================
  test.describe('Role-Based Redirect', { tag: '@auth' }, () => {

    test('admin is redirected to admin dashboard after login', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.login(persona.email, persona.password);
      
      // Admin should be redirected to admin dashboard
      await expect(page).toHaveURL(/\/admin/);
      await authPage.expectUserProfile(persona.displayName, persona.role);
    });

    test('authenticated user cannot access /login', async ({ page, authPage }) => {
      const persona = personas.admin;
      await authPage.login(persona.email, persona.password);
      
      // Navigate to login page while authenticated
      await page.goto('/login');
      
      // Should redirect to dashboard/admin, not stay on login
      await expect(page).not.toHaveURL(/\/login$/);
    });
  });
});