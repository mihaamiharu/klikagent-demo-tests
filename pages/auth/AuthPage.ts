import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // /login locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly registerLink: Locator;
  readonly loginErrorAlert: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  // /dashboard locators (also shared with /doctor, /admin)
  readonly sidebarUserName: Locator;
  readonly sidebarUserRole: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login page locators
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginSubmitButton = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');
    this.loginErrorAlert = page.getByTestId('login-error');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');

    // Sidebar locators (scoped to complementary region for uniqueness)
    this.sidebarUserName = page.getByRole('complementary').getByText(/.*/, { exact: false });
    this.sidebarUserRole = page.getByRole('complementary').getByText(/.*/, { exact: false });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
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
    await this.loginSubmitButton.click();
  }

  /**
   * Fill only email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill only password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Clear email field
   */
  async clearEmail(): Promise<void> {
    await this.emailInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.loginSubmitButton.click();
  }

  /**
   * Logout - click logout button and wait for redirect to login
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/login/);
  }

  /**
   * Expect to be on login page
   */
  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  /**
   * Expect login error alert to be visible with specific text
   */
  async expectLoginError(message: string): Promise<void> {
    await expect(this.loginErrorAlert).toBeVisible();
    await expect(this.loginErrorAlert).toContainText(message);
  }

  /**
   * Expect email validation error
   */
  async expectEmailError(message: string): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toContainText(message);
  }

  /**
   * Expect password validation error
   */
  async expectPasswordError(message: string): Promise<void> {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toContainText(message);
  }

  /**
   * Expect no login error alert
   */
  async expectNoLoginError(): Promise<void> {
    await expect(this.loginErrorAlert).not.toBeVisible();
  }

  /**
   * Expect user is on dashboard
   */
  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  /**
   * Expect user is on doctor page
   */
  async expectOnDoctorPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/doctor/);
  }

  /**
   * Expect user is on admin page
   */
  async expectOnAdminPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin/);
  }

  /**
   * Expect sidebar shows user name and role
   */
  async expectSidebarUser(name: string, role: string): Promise<void> {
    const sidebar = this.page.getByRole('complementary');
    await expect(sidebar.getByText(name, { exact: false })).toBeVisible();
    await expect(sidebar.getByText(role, { exact: false })).toBeVisible();
  }

  /**
   * Expect welcome heading visible with pattern matching role-specific text
   */
  async expectWelcomeHeading(pattern: RegExp): Promise<void> {
    const welcomeHeading = this.page.getByRole('heading', { name: /Welcome/ });
    await expect(welcomeHeading).toBeVisible();
    await expect(welcomeHeading).toMatch(pattern);
  }
}
