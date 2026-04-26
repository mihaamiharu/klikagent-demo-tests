import { Page, Locator, expect } from '@playwright/test';
import { personas, PersonaName } from '../../../config/personas';

export class AuthPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorAlert = page.getByRole('alert');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async fillEmailOnly(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async fillPasswordOnly(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
    await this.submitButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async expectErrorAlertVisible(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  // Persona-aware methods for sidebar assertions
  async expectSidebarUserName(personaName: PersonaName): Promise<void> {
    const sidebar = this.page.getByRole('complementary');
    await expect(sidebar.getByText(personas[personaName].name)).toBeVisible();
  }

  async expectSidebarRole(personaName: PersonaName): Promise<void> {
    const sidebar = this.page.getByRole('complementary');
    await expect(sidebar.getByText(personas[personaName].role)).toBeVisible();
  }

  // Persona-aware method for dashboard heading assertion
  async expectDashboardHeading(personaName: PersonaName): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: personas[personaName].dashboardTitle, level: 1 })
    ).toBeVisible();
  }
}
