import { Page } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  readonly emailInput = this.page.getByTestId('email-input');
  readonly passwordInput = this.page.getByTestId('password-input');
  readonly submitButton = this.page.getByTestId('login-submit');
  readonly errorAlert = this.page.getByTestId('login-error');
  readonly emailError = this.page.getByTestId('email-error');
  readonly passwordError = this.page.getByTestId('password-error');
  readonly sidebarUserName = this.page.getByRole('complementary').getByRole('paragraph');
  readonly sidebarRole = this.page.getByRole('complementary');
  readonly logoutButton = this.page.getByRole('button', { name: 'Log out' });
  readonly welcomeHeading = this.page.getByRole('heading', { name: /^Welcome/ });

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async clickSignIn() {
    await this.submitButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async getErrorAlertText(): Promise<string> {
    return this.errorAlert.textContent() ?? '';
  }
}
