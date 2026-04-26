import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;
  readonly loginError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  // Sidebar elements
  readonly sidebarLogoutButton: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');
    this.loginError = page.getByTestId('login-error');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.sidebarLogoutButton = page.getByRole('button', { name: 'Log out' });
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome/ });
  }


  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.signInButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.fillLoginForm(email, password);
    await this.submitLogin();
  }

  async logout(): Promise<void> {
    await this.sidebarLogoutButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toHaveText('Invalid email or password');
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText('Invalid email address');
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText('Password must be at least 6 characters');
  }


  async expectWelcomeMessageContains(name: string): Promise<void> {
    await expect(this.welcomeHeading).toContainText(name);
  }

  async getSidebarUserName(): Promise<Locator> {
    return this.page.getByRole('complementary').getByText(/Jane Doe|John Smith|Admin User/);
  }

  async getSidebarUserRole(role: string): Promise<Locator> {
    return this.page.getByRole('complementary').getByText(role, { exact: true });
  }

  async expectSidebarShowsUser(name: string, role: string): Promise<void> {
    await expect(await this.getSidebarUserName()).toBeVisible();
    await expect(await this.getSidebarUserRole(role)).toBeVisible();
  }
}
