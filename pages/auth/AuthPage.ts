import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly loginErrorAlert: Locator;
  readonly heading: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.loginErrorAlert = page.getByRole('alert');
    this.heading = page.getByRole('heading', { name: 'CareSync' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.signInButton.click();
  }

  async submit() {
    await this.signInButton.click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Log out' }).click();
  }

  async expectOnLoginPage() {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginError(message: string) {
    await expect(this.loginErrorAlert).toContainText(message);
  }

  async expectEmailError(message: string) {
    await expect(this.emailError).toContainText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toContainText(message);
  }

  async expectEmailRetained(email: string) {
    await expect(this.emailInput).toHaveValue(email);
  }
}
