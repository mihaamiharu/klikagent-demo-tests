import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly alertMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  readonly heading: Locator;
  readonly subheading: Locator;
  readonly welcomeMessage: Locator;
  readonly sidebarUserName: Locator;
  readonly sidebarUserRole: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;


    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpLink = page.getByText("Don't have an account?").getByText('Sign up');
    this.alertMessage = page.getByRole('alert');
    this.emailError = page.getByText('Invalid email address');
    this.passwordError = page.getByText('Password must be at least 6 characters');

    this.heading = page.getByRole('heading', { name: 'CareSync' });
    this.subheading = page.getByText('Sign in to your account');
    this.welcomeMessage = page.getByRole('heading', { name: /Welcome back/ });
    this.sidebarUserName = page.getByRole('complementary').getByText('Jane Doe');
    this.sidebarUserRole = page.getByRole('complementary').getByText('patient');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.welcomeMessage).toBeVisible();
  }

  async expectLoginError() {
    await expect(this.alertMessage).toContainText('Invalid email or password');
    await expect(this.page).toHaveURL(/\/login/);
  }
}
