import { test, expect } from '../../../fixtures';

test.describe('Auth | Patient Login', { tag: '@auth' }, () => {
  /**
   * Login with valid credentials - redirects to dashboard
   * Acceptance Criteria: As a patient, I should be able to log in with valid 
   * credentials and be redirected to the dashboard.
   */
  test('login with valid credentials redirects to dashboard', 
    { tag: ['@smoke', '@auth'] }, 
    async ({ page }) => {
      // Navigate to login page
      await page.goto('/login');

      // Fill in login form with valid patient credentials
      await page.getByTestId('email-input').fill('testpatient1712500000@test.com');
      await page.getByTestId('password-input').fill('Password123!');

      // Submit the form
      await page.getByTestId('login-submit').click();

      // Verify redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);

      // Verify dashboard content indicates successful login
      await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
    }
  );

  /**
   * Patient dashboard shows patient-specific content
   * Verifies the patient role sees their personalized dashboard after login.
   */
  test('patient dashboard shows patient-specific content', 
    { tag: ['@regression', '@auth'] }, 
    async ({ page }) => {
      // Login as patient
      await page.goto('/login');
      await page.getByTestId('email-input').fill('testpatient1712500000@test.com');
      await page.getByTestId('password-input').fill('Password123!');
      await page.getByTestId('login-submit').click();

      // Verify dashboard URL
      await expect(page).toHaveURL(/\/dashboard/);

      // Verify patient-specific navigation items are visible
      await expect(page.getByTestId('nav-dashboard')).toBeVisible();
      await expect(page.getByTestId('nav-appointments')).toBeVisible();
      await expect(page.getByTestId('nav-book-appointment')).toBeVisible();
      await expect(page.getByTestId('nav-doctors')).toBeVisible();

      // Verify user name is displayed in sidebar
      await expect(page.getByText('TestPatient User')).toBeVisible();
      
      // Verify patient role indicator is shown
      await expect(page.getByText('patient')).toBeVisible();
    }
  );

  /**
   * User can logout successfully
   * Verifies the logout flow returns user to login page.
   */
  test('user can logout successfully', 
    { tag: ['@regression', '@auth'] }, 
    async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByTestId('email-input').fill('testpatient1712500000@test.com');
      await page.getByTestId('password-input').fill('Password123!');
      await page.getByTestId('login-submit').click();

      // Wait for dashboard to load
      await expect(page).toHaveURL(/\/dashboard/);

      // Click logout
      await page.getByTestId('logout-button').click();

      // Verify redirect to login page
      await expect(page).toHaveURL(/\/login/);

      // Verify login form is visible
      await expect(page.getByTestId('email-input')).toBeVisible();
      await expect(page.getByTestId('password-input')).toBeVisible();
    }
  );
});