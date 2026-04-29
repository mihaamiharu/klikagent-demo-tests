import { test, expect, type Page } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: ReturnType<Page['getByLabel']>;
  readonly passwordInput: ReturnType<Page['getByLabel']>;
  readonly loginSubmit: ReturnType<Page['getByRole']>;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginSubmit = page.getByRole('button', { name: 'Sign in' });
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
    await this.page.waitForURL((url) => !url.pathname.endsWith('/login'));
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }

  // Heading locators
  getPatientWelcomeHeading(displayName: string) {
    return this.page.getByRole('heading', { name: `Welcome, ${displayName}` });
  }

  getDoctorWelcomeHeading(displayName: string) {
    return this.page.getByRole('heading', { name: `Welcome, ${displayName}` });
  }

  getAdminDashboardHeading() {
    return this.page.getByRole('heading', { name: 'Admin Dashboard' });
  }

  userDisplayNameLocator(displayName: string) {
    return this.page.getByText(displayName, { exact: true });
  }

  userRoleLocator(role: string) {
    return this.page.getByText(role, { exact: true });
  }

  // Validation expectations
  async expectLoginError(): Promise<void> {
    await expect(this.page.getByRole('alert')).toBeVisible();
  }

  async expectBothValidationErrors(): Promise<void> {
    await expect(this.page.getByText('Email is required')).toBeVisible();
    await expect(this.page.getByText('Password is required')).toBeVisible();
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.page.getByText('Email is required')).toBeVisible();
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.page.getByText('Password is required')).toBeVisible();
  }

  async expectNoEmailValidationError(): Promise<void> {
    await expect(this.page.getByText('Email is required')).not.toBeVisible();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailInput).toBeVisible();
  }

  async expectUnauthenticatedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}