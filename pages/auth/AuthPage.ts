import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // /login locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;

  // Missing locators (semantic fallbacks)
  readonly invalidCredentialsAlert: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;

  // /dashboard locators
  readonly logoutButton: Locator;

  // Sidebar locator for role assertions
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;

    // /login locators
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');

    // Missing locators (semantic fallbacks)
    this.invalidCredentialsAlert = page.getByRole('alert');
    this.emailValidationError = page.getByText('Invalid email address');
    this.passwordValidationError = page.getByText('Password must be at least 6 characters');

    // /dashboard locators
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Sidebar for role assertions
    this.sidebar = page.getByRole('complementary');
  }

  /**
   * Returns a dynamic welcome heading locator for a given displayName.
   * Extracts the first name (first word) to match "Welcome back, Jane!" format.
   */
  welcomeHeading(displayName: string): Locator {
    const firstName = displayName.split(' ')[0];
    return this.page.getByRole('heading', { name: new RegExp(`Welcome.*${firstName}`, 'i') });
  }

  /**
   * Returns a dynamic role heading locator for a given role
   */
  roleHeading(role: string): Locator {
    return this.page.getByRole('heading', { name: new RegExp(role, 'i') });
  }

  /**
   * Navigate to login page
   */
  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Fill login form and submit
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Logout from any authenticated page
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  /**
   * Assert user is on login page
   */
  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /**
   * Assert URL matches the expected pattern
   */
  async expectUrl(pattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Assert user profile is visible in sidebar
   */
  async expectUserProfile(displayName: string, role: string): Promise<void> {
    await expect(this.sidebar.getByText(displayName)).toBeVisible();
    await expect(this.sidebar.getByText(role)).toBeVisible();
  }

  /**
   * Assert invalid credentials error is shown
   */
  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.invalidCredentialsAlert).toContainText('Invalid email or password');
  }

  /**
   * Assert email validation error is visible
   */
  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailValidationError).toBeVisible();
  }

  /**
   * Assert password validation error is visible
   */
  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordValidationError).toBeVisible();
  }

  /**
   * Clear the email field
   */
  async clearEmail(): Promise<void> {
    await this.emailInput.clear();
  }

  /**
   * Clear the password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * Navigate to a specific route
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Assert email input has the expected value
   */
  async expectEmailValue(email: string): Promise<void> {
    await expect(this.emailInput).toHaveValue(email);
  }
}