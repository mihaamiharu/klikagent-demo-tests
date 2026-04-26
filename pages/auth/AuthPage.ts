import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  // Validation error messages
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly loginError: Locator;

  // Dashboard elements (generic)
  readonly welcomeHeading: Locator;
  readonly sidebarUserName: Locator;
  readonly sidebarUserRole: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('login-submit');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.loginError = page.getByTestId('login-error');
    this.welcomeHeading = page.getByRole('heading', { name: /welcome back/i });
    this.sidebarUserName = page.getByRole('complementary').getByRole('paragraph');
    this.sidebarUserRole = page.getByRole('complementary').getByRole('paragraph');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
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
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\login/);
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\login/);
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError).toBeVisible();
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

  async expectUserProfile(expectedName: string, expectedRole: string): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.page.getByRole('heading', { name: new RegExp(expectedName, 'i') })).toBeVisible();
    await expect(this.sidebarUserName.getByText(new RegExp(expectedName, 'i'))).toBeVisible();
    await expect(this.sidebarUserRole.getByText(new RegExp(expectedRole, 'i'))).toBeVisible();
  }

  async expectOnDashboard(expectedName: string, expectedRole: string): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.page.getByRole('heading', { name: new RegExp(expectedName, 'i') })).toBeVisible();
    await expect(this.page.getByRole('complementary').getByText(new RegExp(expectedName, 'i'))).toBeVisible();
    await expect(this.page.getByRole('complementary').getByText(new RegExp(expectedRole, 'i'))).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
