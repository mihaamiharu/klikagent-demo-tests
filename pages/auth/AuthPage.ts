import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // /login locators
  readonly signUpLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly loginError: Locator;
  readonly passwordError: Locator;
  readonly registerLink: Locator;
  readonly emailError: Locator;
  readonly careSyncHeading: Locator;
  readonly signInSubtitle: Locator;

  // Sidebar locators (shared across authenticated pages)
  readonly logoutButton: Locator;

  // /dashboard locators
  readonly dashboardLink: Locator;

  // /admin locators
  readonly adminDashboardLink: Locator;
  readonly adminDashboardHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // /login locators
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error');
    this.passwordError = page.getByTestId('password-error');
    this.registerLink = page.getByTestId('register-link');
    this.emailError = page.getByTestId('email-error');
    this.careSyncHeading = page.getByRole('heading', { name: 'CareSync' });
    this.signInSubtitle = page.getByText('Sign in to your account');

    // Sidebar locators (shared across authenticated pages)
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // /dashboard locators
    this.dashboardLink = page.getByRole('complementary').getByRole('link', { name: 'Dashboard' });

    // /admin locators
    this.adminDashboardLink = page.getByRole('complementary').getByRole('link', { name: 'Admin Dashboard' });
    this.adminDashboardHeading = page.getByRole('heading', { name: 'Admin Dashboard' });
  }

  // Navigation methods
  async gotoLogin() {
    await this.page.goto('/login');
  }

  async gotoDashboard() {
    await this.page.goto('/dashboard');
  }

  async gotoAdmin() {
    await this.page.goto('/admin');
  }

  async gotoDoctor() {
    await this.page.goto('/doctor');
  }

  // Login methods
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.gotoLogin();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  // Logout method
  async logout() {
    await this.logoutButton.click();
  }

  // Dynamic locator getters for parameterized assertions
  getWelcomeHeading(firstName: string): Locator {
    return this.page.getByRole('heading', { name: `Welcome back, ${firstName}!` });
  }

  getSidebarUserName(name: string): Locator {
    return this.page.getByRole('complementary').getByText(name);
  }

  getSidebarUserRole(role: string): Locator {
    return this.page.getByRole('complementary').getByText(role);
  }

  getDoctorWelcomeHeading(name: string): Locator {
    return this.page.getByRole('heading', { name: `Welcome, Dr. ${name}` });
  }

  // Assertion methods
  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.careSyncHeading).toBeVisible();
    await expect(this.signInSubtitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginError(message: string = 'Invalid email or password') {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toContainText(message);
  }

  async expectEmailValidationError(message: string = 'Invalid email address') {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toContainText(message);
  }

  async expectPasswordValidationError(message: string = 'Password must be at least 6 characters') {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toContainText(message);
  }

  async expectOnDashboard(expectedFirstName?: string) {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.dashboardLink).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
    if (expectedFirstName) {
      const welcomeHeading = this.getWelcomeHeading(expectedFirstName);
      await expect(welcomeHeading).toBeVisible();
    }
  }

  async expectOnAdminDashboard() {
    await expect(this.page).toHaveURL(/\/admin/);
    await expect(this.adminDashboardHeading).toBeVisible();
    await expect(this.adminDashboardLink).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async expectOnDoctorDashboard(expectedName?: string) {
    await expect(this.page).toHaveURL(/\/doctor/);
    await expect(this.logoutButton).toBeVisible();
    if (expectedName) {
      const doctorHeading = this.getDoctorWelcomeHeading(expectedName);
      await expect(doctorHeading).toBeVisible();
    }
  }
}
