import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly errorAlert: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly sidebarUserName: Locator;
  readonly sidebarRole: Locator;
  readonly welcomeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.errorAlert = page.locator('[role="alert"]');
    this.emailError = page.locator('p:text("Invalid email address")');
    this.passwordError = page.locator('p:text("Password must be at least 6 characters")');
    this.sidebarUserName = page.locator('span:text("Test User")');
    this.sidebarRole = page.locator('span:text("patient")');
    this.welcomeHeader = page.locator('h1');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Log out' }).click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.welcomeHeader).toContainText('Welcome back');
  }

  async expectWelcomeHeaderContains(text: string): Promise<void> {
    await expect(this.welcomeHeader).toContainText(text);
  }

  async expectSidebarUserName(name: string): Promise<void> {
    await expect(this.sidebarUserName).toContainText(name);
  }

  async expectSidebarRole(role: string): Promise<void> {
    await expect(this.sidebarRole).toContainText(role);
  }

  async expectLoginError(message?: string): Promise<void> {
    if (message) {
      await expect(this.errorAlert).toContainText(message);
    } else {
      await expect(this.errorAlert).toBeVisible();
    }
  }

  async expectEmailError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordError(): Promise<void> {
    await expect(this.passwordError).toBeVisible();
  }

  async expectEmailRetained(email: string): Promise<void> {
    await expect(this.emailInput).toHaveValue(email);
  }

  async expectPasswordCleared(): Promise<void> {
    await expect(this.passwordInput).toHaveValue('');
  }
}