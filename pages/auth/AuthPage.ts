import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly alertError: Locator;
  readonly logoutButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.emailError = page.getByText('Invalid email address');
    this.passwordError = page.getByText('Password must be at least 6 characters');
    this.alertError = page.getByRole('alert');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async navigateToLogin() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginSuccess() {
    await expect(this.logoutButton).toBeVisible();
  }

  async expectLoginError() {
    await expect(this.alertError).toBeVisible();
  }

  async expectEmailValidationError() {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordValidationError() {
    await expect(this.passwordError).toBeVisible();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }
}
