import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorAlert: Locator;
  readonly emailValidation: Locator;
  readonly passwordValidation: Locator;
  readonly logoutButton: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form locators
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });

    // Error and validation locators
    this.errorAlert = page.getByRole('alert');
    this.emailValidation = page.getByText('Invalid email address');
    this.passwordValidation = page.getByText('Password must be at least 6 characters');

    // Sidebar locators (for logged-in state)
    this.logoutButton = page.getByRole('complementary').getByRole('button', { name: 'Log out' });

    // Welcome heading locator
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome back, .+/ });
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Fill login form and submit
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Fill email field only
   */
  async fillEmailField(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password field only
   */
  async fillPasswordField(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submitForm() {
    await this.signInButton.click();
  }

  /**
   * Logout from the application
   */
  async logout() {
    await this.logoutButton.click();
  }

  /**
   * Expect to be on the login page
   */
  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/login/);
  }

  /**
   * Expect successful login and redirect to dashboard
   */
  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/dashboard/);
  }

  /**
   * Expect login error message
   */
  async expectErrorMessage(message: string) {
    await expect(this.errorAlert).toContainText(message);
  }

  /**
   * Expect validation error on email field
   */
  async expectEmailValidationError() {
    await expect(this.emailValidation).toBeVisible();
  }

  /**
   * Expect validation error on password field
   */
  async expectPasswordValidationError() {
    await expect(this.passwordValidation).toBeVisible();
  }

  /**
   * Expect email field to retain value
   */
  async expectEmailRetained(email: string) {
    await expect(this.emailInput).toHaveValue(email);
  }

  /**
   * Expect password field to be empty
   */
  async expectPasswordCleared() {
    await expect(this.passwordInput).toBeEmpty();
  }

  /**
   * Expect sidebar shows user name and role
   */
  async expectSidebarUserInfo(name: string, role: string) {
    await expect(this.page.getByRole('complementary').getByText(name)).toBeVisible();
    await expect(this.page.getByRole('complementary').getByText(role)).toBeVisible();
  }

  /**
   * Expect welcome heading with specific message
   */
  async expectWelcomeHeading(message: string) {
    await expect(this.page.getByRole('heading', { name: message })).toBeVisible();
  }
}
