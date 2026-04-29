import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login page locators
  readonly emailTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly signInButton: Locator;
  readonly errorAlert: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;
  readonly signUpLink: Locator;

  // Dashboard/role pages locators
  readonly welcomeHeading: Locator;
  readonly userDisplayName: Locator;
  readonly logoutButton: Locator;
  readonly dashboardLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login page locators
    this.emailTextbox = page.getByLabel('Email');
    this.passwordTextbox = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorAlert = page.getByTestId('login-error');
    this.emailValidationError = page.locator('p:has-text("Invalid email address")');
    this.passwordValidationError = page.locator('p:has-text("Password must be at least 6 characters")');
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });

    // Shared dashboard locators
    this.welcomeHeading = page.getByRole('heading', { level: 1 });
    this.userDisplayName = page.getByRole('complementary').getByText(/.*/);
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailTextbox.fill(email);
    await this.passwordTextbox.fill(password);
    await this.signInButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailTextbox).toBeVisible();
    await expect(this.passwordTextbox).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectOnRolePage(role: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`\\/${role}\\/?`));
  }

  async expectErrorVisible(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText('Invalid email or password');
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailValidationError).toBeVisible();
    await expect(this.emailValidationError).toContainText('Invalid email address');
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordValidationError).toBeVisible();
    await expect(this.passwordValidationError).toContainText('Password must be at least 6 characters');
  }

  async expectNoValidationErrors(): Promise<void> {
    await expect(this.emailValidationError).not.toBeVisible();
    await expect(this.passwordValidationError).not.toBeVisible();
  }

  async expectWelcomeMessage(firstName: string): Promise<void> {
    await expect(this.welcomeHeading).toContainText(`Welcome back, ${firstName}!`);
  }

  async expectUserProfile(displayName: string, role: string): Promise<void> {
    await expect(this.userDisplayName).toContainText(displayName);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectLoggedOut(): Promise<void> {
    await this.expectOnLoginPage();
  }
}