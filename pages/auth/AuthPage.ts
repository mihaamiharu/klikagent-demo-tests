import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form locators
  readonly heading: Locator;
  readonly emailLabel: Locator;
  readonly emailInput: Locator;
  readonly passwordLabel: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly signInSubtext: Locator;

  // Dashboard locators
  readonly welcomeMessage: Locator;
  readonly sidebarUserName: Locator;
  readonly sidebarUserRole: Locator;
  readonly logOutButton: Locator;
  readonly adminDashboardHeading: Locator;

  // Validation and error locators
  readonly errorAlert: Locator;
  readonly passwordValidationError: Locator;
  readonly emailRequiredError: Locator;
  readonly passwordRequiredError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form
    this.heading = page.getByRole('heading', { name: 'CareSync' });
    this.emailLabel = page.getByText('Email');
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordLabel = page.getByText('Password');
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.signInSubtext = page.getByText('Sign in to your account');

    // Dashboard
    this.welcomeMessage = page.getByRole('heading', { name: /Welcome back, .*/ });
    this.sidebarUserName = page.getByRole('complementary').getByText(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
    this.sidebarUserRole = page.getByRole('complementary').getByText(/^(patient|doctor|admin)$/);
    this.logOutButton = page.getByRole('button', { name: 'Log out' });
    this.adminDashboardHeading = page.getByRole('heading', { name: 'Admin Dashboard' });

    // Errors and validation
    this.errorAlert = page.getByRole('alert');
    this.passwordValidationError = page.getByText('Password must be at least 6 characters');
    this.emailRequiredError = page.getByText('Email is required');
    this.passwordRequiredError = page.getByText('Password is required');
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard|\/admin/);
    await expect(this.welcomeMessage).toBeVisible();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.errorAlert).toBeVisible();
  }

  async expectErrorMessageContains(text: string): Promise<void> {
    await expect(this.errorAlert).toContainText(text);
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordValidationError).toBeVisible();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.heading).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.logOutButton.click();
  }

  async expectEmailRetained(email: string): Promise<void> {
    await expect(this.emailInput).toHaveValue(email);
  }

  async expectPasswordCleared(): Promise<void> {
    await expect(this.passwordInput).toHaveValue('');
  }

  async expectSidebarUserInfo(name: string, role: string): Promise<void> {
    await expect(this.sidebarUserName).toContainText(name);
    await expect(this.sidebarUserRole).toContainText(role);
  }

  async expectWelcomeMessageWithFirstName(firstName: string): Promise<void> {
    await expect(this.welcomeMessage).toContainText(`Welcome back, ${firstName}!`);
  }

  async expectAdminDashboardHeadingVisible(): Promise<void> {
    await expect(this.adminDashboardHeading).toBeVisible();
  }

  async expectCareSyncHeadingVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectEmailRequiredErrorVisible(): Promise<void> {
    await expect(this.emailRequiredError).toBeVisible();
  }

  async expectPasswordRequiredErrorVisible(): Promise<void> {
    await expect(this.passwordRequiredError).toBeVisible();
  }

  async expectBothValidationErrorsVisible(): Promise<void> {
    await expect(this.emailRequiredError).toBeVisible();
    await expect(this.passwordRequiredError).toBeVisible();
  }

  async clearEmailInput(): Promise<void> {
    await this.emailInput.clear();
  }

  async clearPasswordInput(): Promise<void> {
    await this.passwordInput.clear();
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
  }
}
