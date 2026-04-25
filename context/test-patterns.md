# CareSync — Test Conventions

## Import Style

Always import `test` and `expect` from the project fixture layer — never from `@playwright/test` directly:

```typescript
import { test, expect } from '../../../fixtures';
```

(Adjust relative depth based on spec file location: specs live at `tests/web/{feature}/`, so it's always 3 levels up.)

---

## POM Usage

- Always use POM methods and properties. Never re-select elements inline.
- ✅ `await authPage.login(email, password)`
- ❌ `await page.getByLabel('Email').fill(email); await page.getByRole('button', { name: 'Sign in' }).click()`
- If a POM method exists, use it — even if it feels like a wrapper around one line.
- If the POM doesn't have a method you need, add it to the POM first, then call it in the spec.

---

## Role-Based Test Patterns

CareSync has 3 roles with different access. Structure tests to make the role obvious:

```typescript
test.describe('Departments | Admin CRUD', { tag: '@departments' }, () => {
  // These tests run as Admin — use adminPage or login via authPage with admin creds
});
```

For access-denied tests (a role trying to reach a forbidden route), always assert the outcome:
```typescript
await page.goto('/departments');
await expect(page).toHaveURL(/login|dashboard|403/);
```

---

## Fixture Parameters

Check `fixtures/index.ts` before writing a test. If a POM is registered as a fixture, use it as a parameter:

```typescript
// ✅ correct — authPage is registered
async ({ authPage }) => { ... }

// ❌ wrong — don't construct manually
async ({ page }) => { const authPage = new AuthPage(page); ... }
```

---

## Tagging Convention

Every test needs: **feature tag** + **test type tag**

```typescript
test('books appointment successfully', { tag: ['@appointments', '@smoke'] }, async ({ ... }) => {
```

```typescript
test.describe('Appointments | Booking flow', { tag: '@appointments' }, () => {
```

Test types:
- `@smoke` — critical happy path, must pass in every environment
- `@regression` — detailed scenario covering edge cases
- `@full` — exhaustive scenario including all variations

---

## Selector Priority

Prefer semantic locators in this order:
1. `getByRole('button', { name: '...' })` — most resilient
2. `getByLabel('...')` — for form inputs
3. `getByTestId('...')` — when explicit test IDs are set
4. `getByPlaceholder('...')` — fallback for inputs without labels
5. `getByText('...')` — for non-interactive text assertions only

Never use CSS selectors (`.class`, `#id`) or XPath in specs.

---

## Assertions

- Every test must have at least one `expect` assertion.
- Prefer URL assertions after navigation: `await expect(page).toHaveURL(/dashboard/)`
- Prefer text/visibility assertions for feedback messages: `await expect(page.getByRole('alert')).toContainText('success')`
- Don't assert implementation details (class names, DOM structure).

---

## Credentials

Never hardcode email addresses or passwords in specs. Import from `config/personas.ts`:

```typescript
import { personas } from '../../../config/personas';

// then use:
await authPage.login(personas.patient.email, personas.patient.password);
await authPage.login(personas.doctor.email, personas.doctor.password);
await authPage.login(personas.admin.email, personas.admin.password);
```

Available personas: `admin`, `doctor`, `patient` — each has `email`, `password`, `displayName`, and `role`.

---

## Auth Setup

For tests that start logged in, use the `authPage` fixture to log in during setup. Don't repeat login steps inline — extract to POM methods.

```typescript
import { personas } from '../../../config/personas';

test.beforeEach(async ({ authPage }) => {
  await authPage.login(personas.patient.email, personas.patient.password);
});
```

---

## Anti-Patterns to Avoid

- ❌ `page.waitForTimeout(3000)` — use `waitForURL`, `waitForLoadState`, or element visibility instead
- ❌ `page.locator('.btn-primary')` — use semantic locators
- ❌ Hardcoding IDs like `page.locator('#submit-btn')` — fragile, breaks on DOM changes
- ❌ Chaining `expect(...).or()` — this method does not exist. Use `locator.or()` or regex in `toContainText`
- ❌ Importing a POM that doesn't exist yet — the TypeScript compiler will catch this, but don't guess
- ❌ Using `new PageClass(page)` when the fixture is registered — always use fixture parameters
- ❌ Hardcoding credentials like `'jane.doe@caresync.dev'` — use `personas.patient.email` from `config/personas.ts`
