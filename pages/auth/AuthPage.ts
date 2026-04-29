import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginSubmit = page.getByRole('button', { name: 'Sign in' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
    await this.page.waitForLoadState('networkidle');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async getPatientWelcomeHeading(displayName: string): Promise<Locator> {
    return this.page.getByRole('heading', { name: `Welcome, ${displayName}` });
  }

  async getDoctorWelcomeHeading(displayName: string): Promise<Locator> {
    return this.page.getByRole('heading', { name: `Welcome, ${displayName}` });
  }

  getAdminDashboardHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Admin Dashboard' });
  }

  userDisplayNameLocator(displayName: string): Locator {
    return this.page.getByText(displayName).first();
  }

  userRoleLocator(role: string): Locator {
    return this.page.getByText(role, { exact: true }).first();
  }

  private get errorMessage(): Locator {
    return this.page.getByRole('alert');
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  private get emailError(): Locator {
    return this.page.locator('[data-testid="email-error"]');
  }

  private get passwordError(): Locator {
    return this.page.locator('[data-testid="password-error"]');
  }

  async expectBothValidationErrors(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.passwordError).toBeVisible();
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordError).toBeVisible();
  }

  async expectNoEmailValidationError(): Promise<void> {
    await expect(this.emailError).not.toBeVisible();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectUnauthenticatedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}