import { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.alertMessage = page.getByRole('alert');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: /logout/i }).click();
  }

  async getAlert(): Promise<Locator> {
    return this.alertMessage;
  }

  getDashboardUrl(): RegExp {
    return /\/dashboard/;
  }

  getLoginUrl(): RegExp {
    return /\/login/;
  }
}