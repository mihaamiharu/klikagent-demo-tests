import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  get emailInput(): Locator {
    return this.page.getByLabel('Email');
  }

  get passwordInput(): Locator {
    return this.page.getByLabel('Password');
  }

  get loginSubmit(): Locator {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
    await this.page.waitForLoadState('networkidle');
  }

  get logoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Log out' });
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectUnauthenticatedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  // Error locators
  get loginError(): Locator {
    return this.page.getByRole('alert');
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError).toBeVisible();
  }

  get emailValidationError(): Locator {
    return this.page.locator('[data-testid="email-error"], [aria-invalid="true"]').filter({ hasText: /email/i });
  }

  get passwordValidationError(): Locator {
    return this.page.locator('[data-testid="password-error"], [aria-invalid="true"]').filter({ hasText: /password/i });
  }

  async expectBothValidationErrors(): Promise<void> {
    await expect(this.emailValidationError).toBeVisible();
    await expect(this.passwordValidationError).toBeVisible();
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailValidationError).toBeVisible();
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordValidationError).toBeVisible();
  }

  async expectNoEmailValidationError(): Promise<void> {
    await expect(this.emailValidationError).not.toBeVisible();
  }

  // Dynamic welcome headings (methods, not getters — they take displayName as param)
  getPatientWelcomeHeading(displayName: string): Locator {
    return this.page.getByRole('heading', { name: new RegExp(`Welcome, ${displayName}`) });
  }

  getDoctorWelcomeHeading(displayName: string): Locator {
    return this.page.getByRole('heading', { name: new RegExp(`Welcome, ${displayName}`) });
  }

  getAdminDashboardHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Admin Dashboard' });
  }

  // Sidebar user info locators
  userDisplayNameLocator(displayName: string): Locator {
    return this.page.getByText(displayName).first();
  }

  userRoleLocator(role: string): Locator {
    return this.page.getByText(role, { exact: true });
  }
}