import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form locators
  readonly careSyncHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly signUpLink: Locator;

  // Sidebar (authenticated pages)
  readonly sidebar: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form
    this.careSyncHeading = page.getByRole('heading', { name: 'CareSync' });
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('login-submit');
    this.errorAlert = page.getByTestId('login-error');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.signUpLink = page.getByTestId('register-link');

    // Sidebar (authenticated)
    this.sidebar = page.getByRole('complementary');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
    await this.careSyncHeading.waitFor({ state: 'visible' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginWithPartialFields(email: string, password: string): Promise<void> {
    if (email !== undefined) {
      await this.emailInput.fill(email);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.submitButton.click();
  }

  async clearFields(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await this.careSyncHeading.waitFor({ state: 'visible' });
  }

  async expectLoginSuccess(expectedUrlPattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrlPattern);
  }

  async expectLoginErrorVisible(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText('Invalid email or password');
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toContainText('Invalid email address');
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toContainText('Password must be at least 6 characters');
  }

  async expectEmailFieldRetainsValue(email: string): Promise<void> {
    await expect(this.emailInput).toHaveValue(email);
  }

  async expectNoLoginError(): Promise<void> {
    await expect(this.errorAlert).not.toBeVisible();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.expectOnLoginPage();
  }

  async expectUserProfile(name: string, role: string): Promise<void> {
    await expect(this.sidebar.getByText(name)).toBeVisible();
    await expect(this.sidebar.getByText(role, { exact: true })).toBeVisible();
  }

  async expectWelcomeHeading(textPattern: string | RegExp): Promise<void> {
    const heading = this.page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(textPattern);
  }

  async expectAdminHeading(): Promise<void> {
    const heading = this.page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(/Admin Dashboard/);
  }
}