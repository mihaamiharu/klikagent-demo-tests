import { test, expect } from '../../../fixtures';
import { personas } from '../../../config/personas';

test.describe('Auth | Login, validation, logout, and role-based redirect', { tag: '@auth' }, () => {
  test.describe('Login — valid credentials', { tag: '@smoke' }, () => {
    test('redirects to dashboard and shows welcome message with user name', async ({ authPage, page }) => {
      const persona = personas.patient;
      await authPage.login(persona.email, persona.password);

      await expect(page).toHaveURL(/\/dashboard/);
      await expect(authPage.welcomeHeader).toContainText('Welcome back');

      const welcomeText = await authPage.welcomeHeader.textContent();
      expect(welcomeText).toContain(persona.displayName);
    });

    test('shows user full name and role in sidebar', async ({ authPage, page }) => {
      const persona = personas.patient;
      await authPage.login(persona.email, persona.password);

      await authPage.expectSidebarUserName(persona.displayName);
      await authPage.expectSidebarRole(persona.role);
    });
  });

  test.describe('Login — invalid credentials', { tag: '@regression' }, () => {
    test('shows error with wrong password and retains email', async ({ authPage }) => {
      const persona = personas.patient;
      await authPage.login(persona.email, 'WrongPassword123!');

      await authPage.expectLoginError('Invalid email or password');
      await authPage.expectEmailRetained(persona.email);
      await authPage.expectPasswordCleared();
    });

    test('shows error with non-existent email and retains email', async ({ authPage }) => {
      await authPage.login('nonexistent@example.com', 'Password123!');

      await authPage.expectLoginError('Invalid email or password');
      await authPage.expectEmailRetained('nonexistent@example.com');
      await authPage.expectPasswordCleared();
    });
  });

  test.describe('Login — empty fields validation', { tag: '@regression' }, () => {
    test('shows errors on both fields when submitting empty form', async ({ authPage }) => {
      await authPage.signInButton.click();

      await authPage.expectEmailError();
      await authPage.expectPasswordError();
    });

    test('shows password error when only email is filled', async ({ authPage }) => {
      const persona = personas.patient;
      await authPage.emailInput.fill(persona.email);
      await authPage.signInButton.click();

      await authPage.expectPasswordError();
    });

    test('shows email error when only password is filled', async ({ authPage }) => {
      await authPage.passwordInput.fill('Password123!');
      await authPage.signInButton.click();

      await authPage.expectEmailError();
    });
  });

  test.describe('Logout', { tag: '@regression' }, () => {
    test('logs out and redirects to login', async ({ authPage, page }) => {
      const persona = personas.patient;
      await authPage.login(persona.email, persona.password);
      await authPage.logout();

      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Unauthenticated access', { tag: '@regression' }, () => {
    test('redirects to login when navigating to dashboard while logged out', async ({ authPage, page }) => {
      await authPage.navigateTo('/dashboard');

      await expect(page).toHaveURL(/\/login/);
    });
  });
});