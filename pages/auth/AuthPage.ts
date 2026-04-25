import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;

  // Error messages
  readonly errorAlert: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  // Dashboard elements
  readonly welcomeHeading: Locator;
  readonly userNameInSidebar: Locator;
  readonly userRoleInSidebar: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });

    // Error messages
    this.errorAlert = page.getByRole('alert');
    this.emailError = page.locator('p', { hasText: 'Invalid email address' });
    this.passwordError = page.locator('p', { hasText: 'Password must be at least 6 characters' });

    // Dashboard
    this.welcomeHeading = page.getByRole('heading', { name: /^Welcome/ });
    this.userNameInSidebar = page.locator('aside').getByText(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
    this.userRoleInSidebar = page.locator('aside').getByText(/^(patient|doctor|admin)$/);
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorAlert).toContainText(message);
  }

  async expectEmailValidationError() {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordValidationError() {
    await expect(this.passwordError).toBeVisible();
  }

  async expectLoginSuccess() {
    await expect(this.page).not.toHaveURL(/\/login$/);
  }

  async expectWelcomeMessageWithFirstName(firstName: string) {
    await expect(this.welcomeHeading).toContainText(new RegExp(`Welcome back, ${firstName}!`, 'i'));
  }

  async expectSidebarShowsUserInfo(name: string, role: string) {
    await expect(this.userNameInSidebar).toContainText(name);
    await expect(this.userRoleInSidebar).toContainText(role);
  }

  async logout() {
    await this.logoutButton.click();
  }
}
