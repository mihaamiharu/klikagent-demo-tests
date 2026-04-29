import type { Page } from '@playwright/test';
import { Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async submitLogin() {
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  getAlert(): Locator {
    return this.page.getByRole('alert');
  }

  getDashboardHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  getUserRoleText(): Locator {
    return this.page.getByText(/(admin|doctor|patient)/i);
  }

  getLoginHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Sign in to CareSync' });
  }

  async logout() {
    await this.page.getByRole('complementary').getByRole('button', { name: 'Log out' }).click();
  }
}