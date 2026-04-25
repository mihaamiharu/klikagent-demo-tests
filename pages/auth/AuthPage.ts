import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;


  // Login form locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly careSyncHeading: Locator;
  readonly signInSubtext: Locator;

  // Dashboard locators
  readonly welcomeHeading: Locator;
  readonly userName: Locator;
  readonly userRole: Locator;
  readonly logoutButton: Locator;

  // Alert and error locators
  readonly errorAlert: Locator;
  readonly passwordMinLengthError: Locator;
  readonly invalidEmailError: Locator;


  constructor(page: Page) {
    this.page = page;
    
    // Login page elements
    this.emailInput = page.getByTextbox('Email');
    this.passwordInput = page.getByTextbox('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.careSyncHeading = page.getByRole('heading', { name: 'CareSync' });
    this.signInSubtext = page.getByText('Sign in to your account');


    // Dashboard elements
    this.welcomeHeading = page.getByRole('heading', { name: /^Welcome back, .*/ });
    this.userName = page.locator('.sidebar .user-info .user-name, [class*="sidebar"] [class*="user"]').first();
    this.userRole = page.locator('.sidebar .user-info .user-role, [class*="sidebar"] [class*="role"]').first();
    this.logoutButton = page.getByRole('button', { name: 'Log out' });

    // Error messages
    this.errorAlert = page.getByRole('alert');
    this.passwordMinLengthError = page.getByText('Password must be at least 6 characters');
    this.invalidEmailError = page.getByText('Invalid email address');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }


  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\//login/);
    await expect(this.careSyncHeading).toBeVisible();
    await expect(this.signInSubtext).toBeVisible();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\//dashboard/);
    await expect(this.welcomeHeading).toBeVisible();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorAlert).toContainText(message);
  }
}