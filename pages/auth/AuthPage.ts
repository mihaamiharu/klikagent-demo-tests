import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;
  readonly registerLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginSubmit = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.page.getByRole('heading', { name: 'Welcome back, Jane!' })).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}