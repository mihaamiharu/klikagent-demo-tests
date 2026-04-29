import { Page, expect } from '@playwright/test';

export class AuthPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: /sign\s?in/i }).click();
  }

  async expectUserLoggedIn(): Promise<void> {
    await expect(this.page.getByText('Dashboard')).toBeVisible({ timeout: 10000 });
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(message);
  }

  async expectRedirectToLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: /logout/i }).click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('/login');
  }
}