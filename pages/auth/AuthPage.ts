import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorAlert: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;
  readonly sidebarUserName: Locator;
  readonly sidebarUserRole: Locator;
  readonly logoutButton: Locator;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('login-submit');
    this.errorAlert = page.locator('[role="alert"]');
    this.emailValidationError = page.locator('p').filter({ hasText: 'Invalid email address' });
    this.passwordValidationError = page.locator('p').filter({ hasText: /Password must be at least 6 characters/ });
    this.sidebar = page.locator('aside, [role="complementary"], nav');
    this.sidebarUserName = this.sidebar.locator('div').filter({ hasText: /(Jane Doe|Admin User|Dr\. Smith)/ }).first();
    this.sidebarUserRole = this.sidebar.locator('span, div').filter({ hasText: /(admin|doctor|patient)/ }).first();
    this.logoutButton = page.getByTestId('logout-button');
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.gotoLogin();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
    await this.page.waitForURL(/\/(dashboard|admin)/);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/(dashboard|admin)/);
  }

  async expectUserProfile(name: string, role: string): Promise<void> {
    const sidebar = this.page.locator('[role="complementary"]');
    await expect(sidebar.getByText(name)).toBeVisible();
    await expect(sidebar.getByText(role)).toBeVisible();
  }
}