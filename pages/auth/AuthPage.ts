import { Page, Locator, expect } from '@playwright/test';

/**
 * AuthPage - Page Object Model for authentication pages (Login, Register)
 * 
 * Locators are based on the CareSync sign-in form structure:
 * - Email input: input[name="email"]
 * - Password input: input[name="password"]
 * - Sign in button: button[type="submit"]
 * - Alert messages: [role="alert"]
 */
export class AuthPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ============================================================
  // Locators
  // ============================================================

  /**
   * Email input field on the login page
   */
  get emailInput(): Locator {
    return this.page.locator('input[name="email"]');
  }

  /**
   * Password input field on the login page
   */
  get passwordInput(): Locator {
    return this.page.locator('input[name="password"]');
  }

  /**
   * Sign in submit button
   */
  get signInButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  /**
   * Alert/notification element for error or success messages
   */
  get alert(): Locator {
    return this.page.getByRole('alert');
  }

  /**
   * Link to the registration page
   */
  get signUpLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign up' });
  }

  /**
   * Link to the login page (for register page)
   */
  get signInLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  /**
   * CareSync heading on the login page
   */
  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  /**
   * Subheading text "Sign in to your account"
   */
  get subheading(): Locator {
    return this.page.getByText('Sign in to your account');
  }

  /**
   * Email label text
   */
  get emailLabel(): Locator {
    return this.page.getByText('Email').first();
  }

  /**
   * Password label text
   */
  get passwordLabel(): Locator {
    return this.page.getByText('Password').first();
  }

  /**
   * Log out button - parameterized to find button by dynamic text
   */
  logoutButton(roleText: string = 'Log out'): Locator {
    return this.page.getByRole('button', { name: roleText });
  }

  /**
   * Get a locator for user display name text in the UI
   */
  userDisplayName(displayName: string): Locator {
    return this.page.getByText(displayName);
  }

  /**
   * Get a locator for user role text in the UI
   */
  userRole(role: string): Locator {
    return this.page.getByText(role);
  }

  // ============================================================
  // Methods
  // ============================================================

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Perform login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Get the current alert message text
   */
  async getAlertMessage(): Promise<string> {
    return this.alert.textContent() || '';
  }

  /**
   * Get the current value of the email input
   */
  async getEmailValue(): Promise<string> {
    return this.emailInput.inputValue();
  }

  /**
   * Get the current value of the password input
   */
  async getPasswordValue(): Promise<string> {
    return this.passwordInput.inputValue();
  }

  /**
   * Click the logout button (requires being authenticated)
   * @param roleText - The text/name of the logout button
   */
  async logout(roleText: string = 'Log out'): Promise<void> {
    await this.logoutButton(roleText).click();
  }

  /**
   * Check if the user is on the login page
   */
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/login');
  }

  /**
   * Wait for navigation after login
   */
  async waitForLoginNavigation(): Promise<void> {
    await this.page.waitForURL((url) => !url.pathname().includes('/login'));
  }

  /**
   * Verify the login page structure is displayed
   */
  async expectLoginFormVisible(): Promise<void> {
    await expect(this.heading).toContainText('CareSync');
    await expect(this.subheading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /**
   * Verify user profile is displayed with dynamic data
   * @param displayName - The expected user's display name (e.g., 'Admin User', 'Dr. Smith')
   * @param role - The expected user's role (e.g., 'admin', 'doctor')
   */
  async expectUserProfile(displayName: string, role: string): Promise<void> {
    await expect(this.userDisplayName(displayName)).toBeVisible();
    await expect(this.userRole(role)).toBeVisible();
  }
}
