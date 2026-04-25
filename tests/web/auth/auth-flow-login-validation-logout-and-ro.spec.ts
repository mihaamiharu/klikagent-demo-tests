import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {

  test.beforeEach(async ({ page }) => {
    // Clear cookies to ensure clean state
    await page.context().clearCookies();
  });

  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('patient logs in successfully and lands on dashboard', async ({ page, authPage }) => {
      await page.goto('/login');
      
      const signInHeading = page.getByRole('heading', { name: /sign in/i });
      await expect(signInHeading).toBeVisible();

      await page.getByLabel(/email/i).fill(personas.patient.email);
      await page.getByLabel(/password/i).fill(personas.patient.password);
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/dashboard/);
      
      const welcomeHeading = page.getByRole('heading', { name: /welcome/i });
      await expect(welcomeHeading).toBeVisible();

      const sidebar = page.locator('[data-testid="sidebar"]').or(page.locator('aside')).first();
      await expect(sidebar).toContainText(personas.patient.displayName);
      await expect(sidebar).toContainText(/patient/i);
    });

    test('admin logs in successfully and lands on dashboard', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/email/i).fill(personas.admin.email);
      await page.getByLabel(/password/i).fill(personas.admin.password);
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/dashboard/);
      
      const sidebar = page.locator('aside').first();
      await expect(sidebar).toContainText(/admin/i);
    });

    test('doctor logs in successfully and lands on dashboard', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/email/i).fill(personas.doctor.email);
      await page.getByLabel(/password/i).fill(personas.doctor.password);
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/dashboard/);
      
      const sidebar = page.locator('aside').first();
      await expect(sidebar).toContainText(/doctor/i);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('wrong password shows error and does not redirect', async ({ page }) => {
      await page.goto('/login');

      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/password/i);
      
      await emailInput.fill(personas.patient.email);
      await passwordInput.fill('WrongPassword123!');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).not.toHaveURL(/\/dashboard/);
      
      const errorAlert = page.getByRole('alert').or(page.locator('[data-testid="error-message"]'));
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(/invalid|incorrect|wrong/i);
      
      await expect(emailInput).toHaveValue(personas.patient.email);
      await expect(passwordInput).toBeEmpty();
    });

    test('non-existent email shows error and does not redirect', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/email/i).fill('nonexistent@caresync.dev');
      await page.getByLabel(/password/i).fill('Password123!');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).not.toHaveURL(/\/dashboard/);
      
      const errorAlert = page.getByRole('alert');
      await expect(errorAlert).toBeVisible();
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('both empty shows validation errors on both fields', async ({ page }) => {
      await page.goto('/login');

      const signInButton = page.getByRole('button', { name: /sign in/i });
      await signInButton.click();

      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/password/i);

      await expect(emailInput).toHaveAttribute('aria-invalid', 'true')
        .or(emailInput.locator('..').getByText(/required|email is required/i).first().isVisible())
        .or(emailInput.locator('xpath=ancestor::*//*[contains(@class,"error") or contains(@class,"invalid")]').first().isVisible());
      
      await expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
        .or(passwordInput.locator('..').getByText(/required|password is required/i).first().isVisible());

      await expect(page).not.toHaveURL(/\/dashboard/);
    });

    test('only email filled shows password validation error', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/email/i).fill(personas.patient.email);
      await page.getByRole('button', { name: /sign in/i }).click();

      const passwordInput = page.getByLabel(/password/i);
      await expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
        .or(passwordInput.locator('..').getByText(/required|password is required/i).first().isVisible());

      await expect(page).not.toHaveURL(/\/dashboard/);
    });

    test('only password filled shows email validation error', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/password/i).fill(personas.patient.password);
      await page.getByRole('button', { name: /sign in/i }).click();

      const emailInput = page.getByLabel(/email/i);
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true')
        .or(emailInput.locator('..').getByText(/required|email is required|valid email/i).first().isVisible());

      await expect(page).not.toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Logout', { tag: '@smoke' }, () => {
    test('authenticated patient can logout and is redirected to login', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByLabel(/email/i).fill(personas.patient.email);
      await page.getByLabel(/password/i).fill(personas.patient.password);
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page).toHaveURL(/\/dashboard/);

      // Find and click logout button in sidebar
      const logoutButton = page.locator('button').filter({ hasText: /logout|sign out|log out/i }).first();
      await logoutButton.click();

      await expect(page).toHaveURL(/\/login/);
      
      // Verify not redirected back to dashboard
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
    });

    test('navigating to dashboard while logged out redirects to login', async ({ page }) => {
      // Ensure logged out
      await page.context().clearCookies();
      
      await page.goto('/dashboard');
      
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Role-based redirect and navigation', { tag: '@smoke' }, () => {
    test('patient sees patient-specific content and navigation', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel(/email/i).fill(personas.patient.email);
      await page.getByLabel(/password/i).fill(personas.patient.password);
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL(/\/dashboard/);
      
      const sidebar = page.locator('aside').first();
      
      // Patient should see appointments and medical records links
      await expect(sidebar.getByRole('link', { name: /appointments|book/i })).toBeVisible();
      await expect(sidebar.getByRole('link', { name: /records|medical|history/i })).toBeVisible();
      
      // Patient should NOT see admin links
      await expect(sidebar.getByRole('link', { name: /departments|admin|manage/i })).not.toBeVisible();
    });

    test('admin sees admin-specific content and navigation', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel(/email/i).fill(personas.admin.email);
      await page.getByLabel(/password/i).fill(personas.admin.password);
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL(/\/dashboard/);
      
      const sidebar = page.locator('aside').first();
      
      // Admin should see admin links
      await expect(sidebar.getByRole('link', { name: /departments|manage|admin/i })).toBeVisible();
      await expect(sidebar.getByRole('link', { name: /doctors|users/i })).toBeVisible();
      await expect(sidebar.getByRole('link', { name: /patients/i })).toBeVisible();
    });
  });

});