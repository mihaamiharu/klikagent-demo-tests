import { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;
  readonly logoutButton: Locator;
  readonly errorAlert: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginSubmit = page.getByRole('button', { name: 'Sign in' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
    this.errorAlert = page.getByRole('alert');
    this.emailValidationError = page.getByText('Email is required');
    this.passwordValidationError = page.getByText('Password is required');
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText('Invalid email or password');
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

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectUnauthenticatedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  getPatientWelcomeHeading(displayName: string): Locator {
    return this.page.getByRole('heading', { name: `Welcome, ${displayName}!` });
  }

  getDoctorWelcomeHeading(displayName: string): Locator {
    return this.page.getByRole('heading', { name: `Welcome, ${displayName}!` });
  }

  getAdminDashboardHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Admin Dashboard' });
  }

  userDisplayNameLocator(displayName: string): Locator {
    return this.page.getByText(displayName);
  }

  userRoleLocator(role: string): Locator {
    return this.page.getByText(role);
  }
}