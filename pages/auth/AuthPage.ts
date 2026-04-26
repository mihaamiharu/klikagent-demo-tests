import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[id="email"][name="email"]');
    this.passwordInput = page.locator('input[id="password"][name="password"]');
    this.submitButton = page.locator('button:has-text("Sign in")');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.page.locator('p.text-destructive')).toContainText(message);
  }

  async expectValidationError(field: 'email' | 'password', message: string): Promise<void> {
    // Validation errors appear inline below the respective fields
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\//login/);
    await expect(this.submitButton).toBeVisible();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\//dashboard/);
  }

  async expectWelcomeMessage(firstName: string): Promise<void> {
    await expect(this.page.locator('h1')).toContainText(`Welcome back, ${firstName}!`);
  }

  async expectSidebarUserInfo(fullName: string, role: string): Promise<void> {
    await expect(this.page.locator('span:has-text("' + fullName + '")')).toBeVisible();
    await expect(this.page.locator('span:has-text("' + role + '")')).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.locator('button:has-text("Log out")').click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\//login/);
  }
}