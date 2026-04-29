import { Page } from '@playwright/test';
import { expect } from '../../../fixtures';

export class AuthPage {
  constructor(private page: Page) {}

  async login(email: string, password: string): Promise<void> {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: /logout/i }).click();
  }

  async expectLoginSuccess(): Promise<void> {
    await this.page.waitForURL(/\/dashboard/);
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(message);
  }

  async expectUserLoggedIn(displayName: string): Promise<void> {
    await expect(this.page.getByText(displayName)).toBeVisible();
  }

  async expectRedirectToLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}