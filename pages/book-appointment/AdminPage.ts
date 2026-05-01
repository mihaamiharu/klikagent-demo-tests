import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly heading: string;

  // Admin dashboard heading
  readonly adminDashboardHeading: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page, heading: string = 'Admin Dashboard') {
    this.page = page;
    this.heading = heading;
    this.adminDashboardHeading = page.getByRole('heading', { name: heading });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async gotoAdmin(): Promise<void> {
    await this.page.goto('/admin');
  }

  async expectOnAdminPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin/);
  }

  async expectAdminDashboardVisible(): Promise<void> {
    await expect(this.adminDashboardHeading).toBeVisible();
  }

  async expectUserProfile(name: string): Promise<void> {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async expectLogoutButtonVisible(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
  }
}
