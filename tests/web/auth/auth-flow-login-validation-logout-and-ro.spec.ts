import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';
import { AuthPage } from '../../../pages/auth/AuthPage';

test.describe('Auth | Login, Validation, Logout, and Role-based Redirect', { tag: '@auth' }, () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test.describe('Login — Valid Credentials', { tag: '@smoke' }, () => {
    test('Patient logs in and sees dashboard with welcome message', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(page.getByRole('heading', { name: new RegExp(`Welcome back, ${personas.patient.fullName.split(' ')[0]}!`) })).toBeVisible();
    });
    
    test('Patient dashboard shows user full name and role in sidebar', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await expect(page.getByRole('complementary').getByText(personas.patient.fullName)).toBeVisible();
      await expect(page.getByRole('complementary').getByText(personas.patient.role)).toBeVisible();
    });
  });
  
  test.describe('Login — Invalid Credentials', { tag: '@regression' }, () => {
    test('Wrong password shows error and no redirect', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.patient.email, 'wrongpassword123');
      
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByTestId('login-error')).toContainText('Invalid email or password');
    });
    
    test('Non-existent email shows error and no redirect', async ({ page }) => {
      await authPage.goto();
      await authPage.login('nonexistent@test.com', 'wrongpassword123');
      
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByTestId('login-error')).toContainText('Invalid email or password');
    });
    
    test('Email field retains value after failed attempt', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.patient.email, 'wrongpassword123');
      
      await expect(authPage.emailInput).toHaveValue(personas.patient.email);
    });
  });
  
  test.describe('Login — Empty Fields Validation', { tag: '@regression' }, () => {
    test('Both fields empty shows validation errors on both', async ({ page }) => {
      await authPage.goto();
      await authPage.loginSubmit.click();
      
      await expect(authPage.emailError).toBeVisible();
      await expect(authPage.passwordError).toBeVisible();
    });
    
    test('Only email filled shows password validation error', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.patient.email, '');
      
      await expect(authPage.passwordError).toBeVisible();
    });
    
    test('Only password filled shows email validation error', async ({ page }) => {
      await authPage.goto();
      await authPage.login('', personas.patient.password);
      
      await expect(authPage.emailError).toBeVisible();
    });
  });
  
  test.describe('Logout', { tag: '@smoke' }, () => {
    test('Authenticated patient clicks logout and is redirected to login', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await authPage.logout();
      
      await expect(page).toHaveURL(/\/login$/);
    });
    
    test('Navigating to /dashboard while logged out redirects to /login', async ({ page }) => {
      await page.goto('/dashboard');
      
      await expect(page).toHaveURL(/\/login$/);
    });
  });
  
  test.describe('Role-based Redirect', { tag: '@smoke' }, () => {
    test('Admin goes to /admin after login', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.admin.email, personas.admin.password);
      
      await expect(page).toHaveURL(/\/admin$/);
    });
    
    test('Doctor goes to /doctor after login', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.doctor.email, personas.doctor.password);
      
      await expect(page).toHaveURL(/\/doctor$/);
    });
    
    test('Patient goes to /dashboard after login', async ({ page }) => {
      await authPage.goto();
      await authPage.login(personas.patient.email, personas.patient.password);
      
      await expect(page).toHaveURL(/\/dashboard$/);
    });
  });
});