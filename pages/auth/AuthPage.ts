import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // /login locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly errorAlert: Locator;

  // authenticated pages locators (dashboard, doctor, admin)
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // /login locators
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('login-submit');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.errorAlert = page.getByTestId('login-error');

    // Shared authenticated page locators
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async gotoDoctor(): Promise<void> {
    await this.page.goto('/doctor');
  }

  async gotoAdmin(): Promise<void> {
    await this.page.goto('/admin');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectLoginErrorVisible(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
  }

  async expectEmailError(message: string): Promise<void> {
    await expect(this.emailError).toContainText(message);
  }

  async expectPasswordError(message: string): Promise<void> {
    await expect(this.passwordError).toContainText(message);
  }

  async expectEmailFieldValue(value: string): Promise<void> {
    await expect(this.emailInput).toHaveValue(value);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  async expectOnDoctorPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/doctor/);
  }

  async expectOnAdminPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin/);
  }

  async expectWelcomeMessage(expectedName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: `Welcome back, ${expectedName}!` })).toBeVisible();
  }

  async expectAdminDashboardHeading(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  }

  async expectDoctorDashboardHeading(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Welcome, Dr. John Smith' })).toBeVisible();
  }

  async expectUserInfo(name: string, role: string): Promise<void> {
    await expect(this.page.getByRole('complementary').getByText(name)).toBeVisible();
    await expect(this.page.getByRole('complementary').getByText(role, { exact: true })).toBeVisible();
  }
}
