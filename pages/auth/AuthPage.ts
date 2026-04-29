import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  // Login page locators
  readonly signUpLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;
  readonly loginError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  // Sidebar navigation
  readonly sidebarDashboard: Locator;
  readonly sidebarDoctors: Locator;
  readonly sidebarProfile: Locator;
  readonly sidebarNotifications: Locator;
  readonly sidebarMedicalRecords: Locator;
  readonly sidebarDepartments: Locator;
  readonly sidebarPrescriptions: Locator;
  readonly sidebarAppointments: Locator;
  readonly sidebarBookAppointment: Locator;
  readonly sidebarInvoices: Locator;
  readonly logoutButton: Locator;

  // Dynamic user locators
  private userDisplayNameLocator: (displayName: string) => Locator;
  private userRoleLocator: (role: string) => Locator;
  private welcomeHeadingLocator: (name: string) => Locator;
  private welcomeDoctorHeadingLocator: (name: string) => Locator;

  constructor(page: Page) {
    this.page = page;

    // Login page
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginSubmit = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error');
    this.emailError = page.getByText('Invalid email address');
    this.passwordError = page.getByText('Password must be at least 6 characters');

    // Sidebar navigation
    this.sidebarDashboard = page.getByRole('link', { name: 'Dashboard' });
    this.sidebarDoctors = page.getByRole('link', { name: 'Doctors' });
    this.sidebarProfile = page.getByRole('link', { name: 'Profile' });
    this.sidebarNotifications = page.getByRole('link', { name: 'Notifications' });
    this.sidebarMedicalRecords = page.getByRole('link', { name: 'Medical Records' });
    this.sidebarDepartments = page.getByRole('link', { name: 'Departments' });
    this.sidebarPrescriptions = page.getByRole('link', { name: 'Prescriptions' });
    this.sidebarAppointments = page.getByRole('link', { name: 'Appointments' });
    this.sidebarBookAppointment = page.getByRole('link', { name: 'Book Appointment' });
    this.sidebarInvoices = page.getByRole('link', { name: 'Invoices' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });


    // Dynamic locators factory
    this.userDisplayNameLocator = (displayName: string) =>
      page.locator('complementary').getByText(displayName);
    this.userRoleLocator = (role: string) =>
      page.locator('complementary').getByText(role);
    this.welcomeHeadingLocator = (name: string) =>
      page.getByRole('heading', { name: `Welcome back, ${name}!` });
    this.welcomeDoctorHeadingLocator = (name: string) =>
      page.getByRole('heading', { name: `Welcome, Dr. ${name}` });
  }

  // Helper to get welcome heading for patient dashboard
  getPatientWelcomeHeading(name: string): Locator {
    return this.welcomeHeadingLocator(name);
  }

  // Helper to get welcome heading for doctor dashboard
  getDoctorWelcomeHeading(name: string): Locator {
    return this.welcomeDoctorHeadingLocator(name);
  }

  // Helper to get admin dashboard heading
  getAdminDashboardHeading(name: string): Locator {
    return this.page.getByRole('heading', { name: `Admin Dashboard - ${name}` });
  }

  // Login actions
  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
  }

  async expectLoginPage(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginSubmit).toBeVisible();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toContainText('Invalid email or password');
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordValidationError(): Promise<void> {
    await expect(this.passwordError).toBeVisible();
  }

  async expectBothValidationErrors(): Promise<void> {
    await expect(this.emailError).toBeVisible();
    await expect(this.passwordError).toBeVisible();
  }

  async expectNoEmailValidationError(): Promise<void> {
    await expect(this.emailError).not.toBeVisible();
  }

  // Logout
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailInput).toBeVisible();
  }

  // Dashboard assertions
  async expectPatientDashboard(userFirstName: string, userDisplayName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.welcomeHeadingLocator(userFirstName)).toBeVisible();
    await expect(this.userDisplayNameLocator(userDisplayName)).toBeVisible();
    await expect(this.userRoleLocator('patient')).toBeVisible();
  }

  async expectDoctorDashboard(userDisplayName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/doctor/);
    await expect(this.welcomeDoctorHeadingLocator(userDisplayName)).toBeVisible();
    await expect(this.userDisplayNameLocator(userDisplayName)).toBeVisible();
    await expect(this.userRoleLocator('doctor')).toBeVisible();
  }

  async expectAdminDashboard(userDisplayName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin/);
    await expect(this.getAdminDashboardHeading(userDisplayName)).toBeVisible();
    await expect(this.userDisplayNameLocator(userDisplayName)).toBeVisible();
    await expect(this.userRoleLocator('admin')).toBeVisible();
  }

  // Unauthenticated access check
  async expectUnauthenticatedRedirect(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }
}