import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly headingCareSync: Locator;
  readonly headingSignIn: Locator;
  readonly errorAlert: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.headingCareSync = page.getByRole('heading', { name: 'CareSync', level: 1 });
    this.headingSignIn = page.getByRole('heading', { name: 'Sign in to your account' });
    this.errorAlert = page.getByRole('alert');
    this.emailError = page.getByText('Invalid email address');
    this.passwordError = page.getByText('Password must be at least 6 characters');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL(/dashboard/);
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
  }

  async expectLoginSuccess(expectedName?: string): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    if (expectedName) {
      await expect(this.page.getByRole('heading', { name: new RegExp(`Welcome back, ${expectedName}!`) })).toBeVisible();
    }
  }

  async submitWithEmptyFields(): Promise<void> {
    await this.submitButton.click();
  }
}
