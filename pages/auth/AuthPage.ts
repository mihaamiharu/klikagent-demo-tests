import { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly alert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /sign in/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.alert = page.getByRole('alert');
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async navigateToDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async clickLogoutButton(): Promise<void> {
    await this.logoutButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.navigateToLogin();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  getAlert(): Locator {
    return this.alert;
  }

  getLoginUrl(): Page {
    return this.page;
  }

  getDashboardUrl(): Page {
    return this.page;
  }
}