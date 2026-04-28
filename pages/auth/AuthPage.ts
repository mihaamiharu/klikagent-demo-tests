import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login form elements
  readonly heading: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  // Login page validation messages
  readonly invalidEmailError: Locator;
  readonly passwordMinLengthError: Locator;
  readonly invalidCredentialsAlert: Locator;

  // Dashboard elements (shared sidebar)
  readonly logoutButton: Locator;
  readonly sidebarBrand: Locator;
  readonly sidebarUserName: Locator;
  readonly sidebarUserRole: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login form elements
    this.heading = page.getByRole('heading', { name: 'CareSync' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });

    // Validation messages
    this.invalidEmailError = page.getByText('Invalid email address');
    this.passwordMinLengthError = page.getByText('Password must be at least 6 characters');
    this.invalidCredentialsAlert = page.getByRole('alert');

    // Sidebar elements
    this.logoutButton = page.getByRole('complementary').getByRole('button', { name: 'Log out' });
    this.sidebarBrand = page.getByRole('complementary').getByText('CareSync');
    this.sidebarUserName = page.getByRole('complementary').getByText(personas.patient.fullName);
    this.sidebarUserRole = page.getByRole('complementary').getByText(personas.patient.role);

    // Dashboard heading
    this.welcomeHeading = page.getByRole('heading', { level: 1 });
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/(dashboard|admin|doctor)/);
    await expect(this.logoutButton).toBeVisible();
  }

  async expectLoginFailure(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.invalidCredentialsAlert).toBeVisible();
  }

  async expectPatientRedirect(): Promise<void> {
    await expect(this.page).toHaveURL('/dashboard');
  }

  async expectAdminRedirect(): Promise<void> {
    await expect(this.page).toHaveURL('/admin');
  }

  async expectDoctorRedirect(): Promise<void> {
    await expect(this.page).toHaveURL('/doctor');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL('/dashboard');
  }

  async expectOnAdminDashboard(): Promise<void> {
    await expect(this.page).toHaveURL('/admin');
  }

  async expectOnDoctorDashboard(): Promise<void> {
    await expect(this.page).toHaveURL('/doctor');
  }
}
