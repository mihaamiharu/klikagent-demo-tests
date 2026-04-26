import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;
  readonly registerLink: Locator;

  // Error messages
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly loginError: Locator;

  // Dashboard elements (used after login)
  readonly welcomeHeading: Locator;
  readonly userNameInSidebar: Locator;
  readonly userRoleInSidebar: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form elements
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginSubmit = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');

    // Error messages
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.loginError = page.getByTestId('login-error');

    // Dashboard elements
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome back, .*/ });
    this.userNameInSidebar = page.getByRole('complementary').getByText(/.* Doe/);
    this.userRoleInSidebar = page.getByRole('complementary').getByText(/patient|doctor|admin/);
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
  }

  async expectLoginError() {
    await expect(this.loginError).toBeVisible();
  }

  async expectEmailError() {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordError() {
    await expect(this.passwordError).toBeVisible();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginSubmit).toBeVisible();
  }

  async expectOnDashboard() {
    await expect(this.page).toHaveURL(/\/dashboard$/);
    await expect(this.welcomeHeading).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async expectEmailRetained(email: string) {
    await expect(this.emailInput).toHaveValue(email);
  }
}
