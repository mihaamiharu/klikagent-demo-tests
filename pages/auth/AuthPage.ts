import { Page, Locator, Expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly alert: Locator;
  readonly logoutButton: Locator;
  readonly loginUrl: string = '/login';
  readonly dashboardUrl: string = '/dashboard';

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.alert = page.getByRole('alert');
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  getAlert(): Locator {
    return this.alert;
  }

  getDashboardUrl(): string {
    return this.dashboardUrl;
  }

  getLoginUrl(): string {
    return this.loginUrl;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.loginUrl);
  }

  async expectLoginUrl(): Promise<Expect<Page>> {
    return expect(this.page).toHaveURL(new RegExp(this.loginUrl));
  }

  async expectDashboardUrl(): Promise<Expect<Page>> {
    return expect(this.page).toHaveURL(new RegExp(this.dashboardUrl));
  }
}
