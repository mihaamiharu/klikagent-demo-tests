import { Locator, Page } from '@playwright/test';
import { personas } from '../../config/personas';
import { expect } from '@playwright/test';

/**
 * QaAuthPage - POM for QA authentication flows (login, logout)
 * Feature: QA auth validation
 */
export class QaAuthPage {
  readonly page: Page;
  
  // Page elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly alertMessage: Locator;
  readonly logoutButton: Locator;
  readonly dashboardHeading: Locator;
  
  // URLs
  readonly loginUrl: string = '/login';
  readonly dashboardUrlPattern: RegExp = /\/dashboard|\/patients|\/doctors|\/departments/;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /sign in|login|submit/i });
    this.alertMessage = page.getByRole('alert');
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    this.dashboardHeading = page.getByRole('heading', { name: /dashboard/i });
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.loginUrl);
  }

  /**
   * Fill login form and submit
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Login with a persona
   */
  async loginAs(personaName: 'admin' | 'doctor' | 'patient'): Promise<void> {
    const persona = personas[personaName];
    await this.login(persona.email, persona.password);
  }

  /**
   * Get alert locator for assertions
   */
  getAlert(): Locator {
    return this.alertMessage;
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  /**
   * Wait for dashboard URL after successful login
   */
  async expectDashboardUrl(): Promise<void> {
    await expect(this.page).toHaveURL(this.dashboardUrlPattern);
  }

  /**
   * Wait for login URL after logout or redirect
   */
  async expectLoginUrl(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.loginUrl));
  }

  /**
   * Assert dashboard heading is visible
   */
  async expectDashboardHeadingVisible(): Promise<void> {
    await expect(this.dashboardHeading).toBeVisible();
  }
}