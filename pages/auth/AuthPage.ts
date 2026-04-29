import { Page } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  get emailInput() {
    return this.page.getByLabel('Email');
  }

  get passwordInput() {
    return this.page.getByLabel('Password');
  }

  get loginSubmit() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
    await this.page.waitForLoadState('networkidle');
  }

  get logoutButton() {
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
  get loginError() {
    return this.page.getByRole('alert');
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError).toBeVisible();
  }

  get emailValidationError() {
    return this.page.locator('[data-testid="email-error"], invalid').filter({ hasText: /email/i });
  }

  get passwordValidationError() {
    return this.page.locator('[data-testid="password-error"], invalid').filter({ hasText: /password/i });
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

  // Dynamic welcome headings
  getPatientWelcomeHeading(displayName: string) {
    return this.page.getByRole('heading', { name: new RegExp(`Welcome, ${displayName}`) });
  }

  getDoctorWelcomeHeading(displayName: string) {
    return this.page.getByRole('heading', { name: new RegExp(`Welcome, ${displayName}`) });
  }

  getAdminDashboardHeading() {
    return this.page.getByRole('heading', { name: 'Admin Dashboard' });
  }

  // Sidebar user info locators
  userDisplayNameLocator(displayName: string) {
    return this.page.getByText(displayName).first();
  }

  userRoleLocator(role: string) {
    return this.page.getByText(role, { exact: true });
  }
}

import { expect } from '@playwright/test';