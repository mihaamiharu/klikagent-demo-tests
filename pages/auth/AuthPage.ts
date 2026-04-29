import { Page, Locator, expect } from '@playwright/test';
import { personas } from '../../config/personas';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.alertMessage = page.getByRole('alert');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAsAdmin(): Promise<void> {
    await this.login(personas.admin.email, personas.admin.password);
  }

  async loginAsDoctor(): Promise<void> {
    await this.login(personas.doctor.email, personas.doctor.password);
  }

  async loginAsPatient(): Promise<void> {
    await this.login(personas.patient.email, personas.patient.password);
  }

  async expectValidationError(): Promise<void> {
    await expect(this.alertMessage).toBeVisible();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.alertMessage).toContainText('Invalid');
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: /logout|sign out/i }).click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard|admin|doctor|patient/);
  }

  async expectUserInfo(email: string, displayName: string): Promise<void> {
    await expect(this.page.getByText(displayName)).toBeVisible();
  }
}