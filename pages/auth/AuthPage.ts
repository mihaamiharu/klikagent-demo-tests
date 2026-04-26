import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form elements
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;


  // Error messages
  readonly errorAlert: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;


  // Dashboard elements (for authenticated state)
  readonly sidebar: Locator;
  readonly userName: Locator;
  readonly userRole: Locator;
  readonly logoutButton: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form
    this.heading = page.getByRole('heading', { name: 'CareSync', level: 1 });
    this.subtitle = page.getByText('Sign in to your account');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });


    // Error messages
    this.errorAlert = page.getByRole('alert');
    this.emailValidationError = page.getByText('Invalid email address');
    this.passwordValidationError = page.getByText('Password must be at least 6 characters');

    // Dashboard sidebar (authenticated state)
    this.sidebar = page.getByRole('complementary');
    this.userName = this.sidebar.getByText('Jane Doe');
    this.userRole = this.sidebar.getByText('patient');
    this.logoutButton = page.getByTestId('logout-button');
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome back, .*/ });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
    await this.signInButton.click();
  }

  async fillEmailOnly(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill('');
    await this.signInButton.click();
  }

  async fillPasswordOnly(password: string): Promise<void> {
    await this.emailInput.fill('');
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.heading).toBeVisible();
    await expect(this.subtitle).toBeVisible();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.welcomeHeading).toBeVisible();
  }

  async expectWelcomeWithUserName(firstName: string): Promise<void> {
    await expect(this.welcomeHeading).toContainText(`Welcome back, ${firstName}!`);
  }

  async expectSidebarUserInfo(displayName: string, role: string): Promise<void> {
    await expect(this.userName).toContainText(displayName);
    await expect(this.userRole).toContainText(role);
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorAlert).toContainText(message);
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailValidationError).toBeVisible();
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordValidationError).toBeVisible();
  }

  async expectEmailRetained(value: string): Promise<void> {
    await expect(this.emailInput).toHaveValue(value);
  }

  async expectPasswordCleared(): Promise<void> {
    await expect(this.passwordInput).toHaveValue('');
  }

  async logout(): Promise<void> {
    await this.logoutButton.first().click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}
