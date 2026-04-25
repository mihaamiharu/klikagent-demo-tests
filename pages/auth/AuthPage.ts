import { Page, Locator } from '@playwright/test';

/**
 * AuthPage - Page Object Model for authentication flows
 * Handles login, logout, and registration interactions
 */
export class AuthPage {
  private page: Page;

  // Login page locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly registerLink: Locator;

  // Register page locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly registerSubmitButton: Locator;
  readonly loginLink: Locator;

  // Dashboard/logout locators
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form elements
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginSubmitButton = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');

    // Registration form elements
    this.firstNameInput = page.getByTestId('firstName-input');
    this.lastNameInput = page.getByTestId('lastName-input');
    this.registerSubmitButton = page.getByTestId('register-submit');
    this.loginLink = page.getByTestId('login-link');

    // Dashboard elements
    this.logoutButton = page.getByTestId('logout-button');
  }

  /**
   * Navigate to the login page
   */
  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Navigate to the registration page
   */
  async navigateToRegister(): Promise<void> {
    await this.page.goto('/register');
  }

  /**
   * Fill login form and submit
   * @param email User's email address
   * @param password User's password
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  /**
   * Fill registration form and submit
   * @param firstName User's first name
   * @param lastName User's last name
   * @param email User's email address
   * @param password User's password
   */
  async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerSubmitButton.click();
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  /**
   * Check if the page shows an error message
   * @param expectedError Expected error message text
   */
  async expectErrorMessage(expectedError: string): Promise<void> {
    const errorAlert = this.page.locator('[role="alert"]');
    await expect(errorAlert).toContainText(expectedError);
  }

  /**
   * Check if user is on the dashboard page
   */
  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  /**
   * Check if user is on the login page
   */
  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  /**
   * Get the current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}

// Helper to import expect within POM methods
import { expect } from '@playwright/test';
