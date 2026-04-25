import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('login-submit');
    this.errorAlert = page.getByRole('alert');
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL(/dashboard|admin/);
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard|admin/);
  }

  async expectLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.page.getByRole('heading', { name: 'CareSync' })).toBeVisible();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorAlert).toContainText(message);
  }

  async logout(): Promise<void> {
    const logoutButton = this.page.getByRole('complementary').getByRole('button', { name: 'Log out' });
    await logoutButton.click();
    await this.page.waitForURL(/login/);
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
  }

  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.submitButton.click();
  }
}
