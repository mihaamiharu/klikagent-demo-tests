import { type Page, type Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginSubmit = page.getByRole('button', { name: /sign\s?in/i });
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
    await this.page.getByRole('button', { name: /logout/i }).click();
  }

  getPatientWelcomeHeading(displayName: string): Locator {
    return this.page.getByRole('heading', { name: `Welcome back, ${displayName}` });
  }

  getDoctorWelcomeHeading(displayName: string): Locator {
    return this.page.getByRole('heading', { name: `Welcome, ${displayName}` });
  }

  getAdminDashboardHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Admin Dashboard' });
  }

  userDisplayNameLocator(displayName: string): Locator {
    return this.page.getByText(displayName);
  }

  userRoleLocator(role: string): Locator {
    return this.page.getByText(new RegExp(`\\b${role}\\b`, 'i'));
  }

  async expectLoginError(): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(/invalid credentials|login failed/i);
  }

  async expectBothValidationErrors(): Promise<void> {
    await expect(this.emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(this.passwordInput).toHaveAttribute('aria-invalid', 'true');
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailInput).toHaveAttribute('aria-invalid', 'true');
  }

  async expectNoEmailValidationError(): Promise<void> {
    await expect(this.emailInput).not.toHaveAttribute('aria-invalid', 'true');
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('aria-invalid', 'true');
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailInput).toBeVisible();
  }

  async expectUnauthenticatedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}