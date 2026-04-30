# klikagent-demo-tests

Playwright test output repository for [KlikAgent](https://github.com/mihaamiharu/klikagent). This is the **target repo** — KlikAgent writes generated specs and Page Object Models here via GitHub branches and draft PRs.

Also hosts the CI runner and GitHub Actions trigger workflow.

---

## Role in the KlikAgent System

```
klikagent-demo-tests
  ├── Issue created from template → labeled "klikagent"
  │     └── klikagent-trigger.yml fires
  │           └── parses issue body → POST /tasks → KlikAgent (VPS)
  │
  ├── KlikAgent opens a Draft PR here with generated spec + POM
  │
  └── playwright.yml runs on PR
        ├── Runs generated tests against https://app.testingwithekki.com
        └── Reports results back to KlikAgent → POST /tasks/:id/results
```

Target app: **CareSync** — a healthcare management platform with Admin, Doctor, and Patient roles across 7 feature areas.

---

## Repository Structure

```
.github/
├── workflows/
│   ├── klikagent-trigger.yml   # Issue labeled → POST /tasks to KlikAgent
│   └── playwright.yml          # PR/push → run tests → report results
└── ISSUE_TEMPLATE/
    └── qa-task.yml             # Structured issue template for QA tasks

config/
├── personas.ts                 # Test account credentials (admin, doctor, patient)
├── personas.json               # JSON version of personas
├── keywords.json               # App-specific vocabulary
└── routes.ts                   # Feature → URL entrypoint mapping

context/
├── domain.md                   # CareSync domain knowledge (entities, business rules)
├── personas.md                 # Persona descriptions and use cases
└── test-patterns.md            # Recommended Playwright test patterns for this app

fixtures/
└── index.ts                    # Playwright fixture definitions (POM auto-registration)

pages/                          # Generated Page Object Models
└── {feature}/
    └── {PageName}.ts

tests/
└── web/
    └── {feature}/
        └── {taskId}.spec.ts    # Generated Playwright specs

utils/
└── helpers.ts                  # Shared test utilities
```

---

## Creating a QA Task

Use the issue template: **Issues → New Issue → QA Task**.

Fields:

| Field | Description |
|---|---|
| Acceptance Criteria | What the test should verify |
| Feature | One of: `auth`, `dashboard`, `doctors`, `patients`, `appointments`, `records`, `departments` |
| QA Environment URL | Default: `https://app.testingwithekki.com` |
| Output Repo | Default: `klikagent-demo-tests` |

The template automatically applies the `klikagent` label, which triggers the `klikagent-trigger.yml` workflow.

---

## CI Workflows

### klikagent-trigger.yml

**Trigger:** Issue labeled with `klikagent`

**What it does:**
1. Parses the issue body fields (Acceptance Criteria, Feature, QA Environment URL, Output Repo)
2. POSTs to `KLIKAGENT_URL/tasks` with a normalized `QATask` payload
3. Comments on the issue: "KlikAgent received this task"

**Required secrets:** `KLIKAGENT_URL`

### playwright.yml

**Trigger:** Pull request targeting `main`, push to `main`, or manual dispatch

**What it does:**
1. **Smoke tests** — runs `@smoke` tagged tests on every PR (fast feedback)
2. **E2E tests** — runs full suite sharded across 4 workers on push to main
3. Uploads Playwright HTML reports as CI artifacts (viewable from Actions tab)
4. Reports results to KlikAgent: `POST /tasks/{taskId}/results`

**Required secrets:** `KLIKAGENT_URL`, `KLIKAGENT_TASK_ID` (set from PR branch name)

---

## Generated Artifacts

When KlikAgent processes a QA task, it opens a Draft PR with these files committed to branch `qa/{taskId}-{slug}`:

| File | Example |
|---|---|
| Spec | `tests/web/auth/42.spec.ts` |
| POM | `pages/auth/AuthPage.ts` |
| Fixture update | `fixtures/index.ts` (new POM import added) |

The Draft PR must be reviewed and approved by a QA engineer before merge. This is intentional — human review is load-bearing, not optional.

---

## Test Personas

Defined in `config/personas.ts`:

| Persona | Role | Use case |
|---|---|---|
| `admin` | Admin | Admin-only views, user management |
| `doctor` | Doctor | Appointment management, patient records |
| `patient` | Patient | Self-service views, booking appointments |

Specs must import personas from fixtures — hardcoded credentials in specs are a self-correction violation.

---

## Feature → Route Mapping

Defined in `config/routes.ts`:

| Feature | Entrypoint |
|---|---|
| `auth` | `/login` |
| `users` | `/profile` |
| `departments` | `/departments` |
| `doctors` | `/doctors` |
| `patients` | `/patients` |
| `appointments` | `/appointments` |
| `records` | `/medical-records` |
| `attachments` | `/medical-records` |

---

## Local Setup

```bash
npm install
npx playwright install

# Run all tests
npx playwright test

# Run tests for a single feature
npx playwright test tests/web/auth/

# Run with UI mode
npx playwright test --ui
```

**Requires access to** `https://app.testingwithekki.com` (CareSync demo app).

---

## Domain Knowledge — CareSync

Summarized from `context/domain.md`:

**Roles:**
- **Admin** — full access, manages users/departments/doctors/patients
- **Doctor** — sees assigned patients and appointments, writes medical records
- **Patient** — sees own appointments and records, cannot access other patients

**Key entities:** User, Department, Doctor, Patient, Appointment, Medical Record, Attachment

**Business rules:**
- Appointments require a matching availability slot for the doctor
- Appointment status lifecycle: Pending → Confirmed → Completed / Cancelled
- Medical records are write-once — only the authoring doctor can edit
- Attachments belong to medical records (scoped to patient)

---

## Convention Rules

These are enforced by KlikAgent's self-correction loop and must be maintained in manually written tests too:

1. **No raw credentials in specs** — always use `fixtures/index.ts` personas
2. **Locators belong in POMs** — specs must not call `page.locator()` directly
3. **POM must be used** — every spec must import and use its Page Object Model
