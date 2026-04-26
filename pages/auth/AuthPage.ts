import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly signUpLink: Locator;
  readonly errorAlert: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByTestId('login-submit');
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.errorAlert = page.getByRole('alert');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginWithInvalidPassword(email: string, invalidPassword: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(invalidPassword);
    await this.submitButton.click();
  }

  async loginWithNonExistentEmail(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.submitButton.click();
  }

  async submitWithEmailOnly(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async submitWithPasswordOnly(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout(): Promise<void> {
    await this.page.getByTestId('logout-button').click();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}
