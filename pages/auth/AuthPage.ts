import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  
  // Login form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signInHeading: Locator;
  
  // Sidebar elements (after login)
  readonly sidebar: Locator;
  readonly userNameInSidebar: Locator;
  readonly userRoleInSidebar: Locator;
  readonly logoutButton: Locator;
  
  // Dashboard elements
  readonly welcomeHeading: Locator;
  
  // Error/alert elements
  readonly errorMessage: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    // Login form
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.signInHeading = page.getByRole('heading', { name: /sign in/i });
    
    // Sidebar
    this.sidebar = page.locator('aside').first();
    this.userNameInSidebar = this.sidebar;
    this.userRoleInSidebar = this.sidebar;
    this.logoutButton = this.sidebar.getByRole('button', { name: /logout|sign out|log out/i });
    
    // Dashboard
    this.welcomeHeading = page.getByRole('heading', { name: /welcome/i });
    
    // Error
    this.errorMessage = page.getByRole('alert').or(page.locator('[data-testid="error-message"]'));
  }

  /**
   * Navigate to login page and verify it's loaded
   */
  async goto() {
    await this.page.goto('/login');
    await expect(this.signInHeading).toBeVisible();
  }

  /**
   * Fill login form with email and password
   */
  async fillLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submitLogin() {
    await this.signInButton.click();
  }

  /**
   * Complete login flow — fills credentials and submits
   */
  async login(email: string, password: string) {
    await this.goto();
    await this.fillLoginForm(email, password);
    await this.submitLogin();
  }

  /**
   * Expect successful login — redirected to dashboard with welcome message
   */
  async expectLoginSuccess(firstName: string) {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.welcomeHeading).toContainText(firstName);
  }

  /**
   * Expect login failure — error message visible, still on login page
   */
  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.page).not.toHaveURL(/\/dashboard/);
  }

  /**
   * Verify email retained and password cleared after failed attempt
   */
  async expectCredentialsRetained(email: string) {
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.passwordInput).toBeEmpty();
  }

  /**
   * Verify user info displayed in sidebar
   */
  async expectUserInSidebar(displayName: string, role: string) {
    await expect(this.sidebar).toContainText(displayName);
    await expect(this.sidebar).toContainText(new RegExp(role, 'i'));
  }

  /**
   * Click logout button in sidebar
   */
  async logout() {
    await this.logoutButton.click();
  }

  /**
   * Expect logout redirect to login page
   */
  async expectLoggedOut() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  /**
   * Check if email input has validation error
   */
  async expectEmailValidationError() {
    const emailContainer = this.emailInput.locator('..');
    const isInvalid = await this.emailInput.getAttribute('aria-invalid');
    if (isInvalid === 'true') {
      await expect(this.emailInput).toHaveAttribute('aria-invalid', 'true');
    } else {
      await expect(emailContainer.getByText(/required|email is required|valid email/i).first()).toBeVisible();
    }
  }

  /**
   * Check if password input has validation error
   */
  async expectPasswordValidationError() {
    const passwordContainer = this.passwordInput.locator('..');
    const isInvalid = await this.passwordInput.getAttribute('aria-invalid');
    if (isInvalid === 'true') {
      await expect(this.passwordInput).toHaveAttribute('aria-invalid', 'true');
    } else {
      await expect(passwordContainer.getByText(/required|password is required/i).first()).toBeVisible();
    }
  }

  /**
   * Navigate to dashboard — for checking auth redirects
   */
  async gotoDashboard() {
    await this.page.goto('/dashboard');
  }
}