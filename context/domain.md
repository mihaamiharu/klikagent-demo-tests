# CareSync — Domain Knowledge

## What CareSync Does

CareSync is a full-stack healthcare management platform that digitizes clinic operations. It handles patient registration, doctor scheduling, appointment booking, medical record management, and file attachments — all behind a role-based access model.

The platform has three user roles: **Admin**, **Doctor**, and **Patient**. Each role sees a different slice of the application. Admins manage the organizational structure (departments, doctors, users). Doctors manage their own schedules and create medical records for their patients. Patients book appointments and view their own medical history.

## Key Entities

- **User** — base account with a role (Admin, Doctor, Patient). Has a profile and optional avatar.
- **Department** — organizational unit (e.g. Cardiology, Neurology). Doctors belong to departments.
- **Doctor** — a user with the Doctor role. Has a schedule with weekly availability slots.
- **Patient** — a user with the Patient role. Can book appointments and has a medical history.
- **Appointment** — a booking between a Patient and a Doctor at a specific time. Has a status lifecycle: `pending → confirmed → completed → cancelled`.
- **Medical Record** — a clinical record created by a Doctor for a Patient, attached to a completed appointment. Contains diagnosis, treatment notes, and optional file attachments.
- **Attachment** — a file (PDF, image, etc.) uploaded by a Doctor or Admin, associated with a Medical Record.

## Business Rules That Affect Test Logic

- A Patient can only book an appointment if the Doctor has an available slot at that time.
- Only a Doctor can create a Medical Record — and only for their own patients.
- Medical Records are visible to: the creating Doctor, the Patient it belongs to, and Admins.
- File attachments are downloadable by: the owning Doctor, the associated Patient, and Admins.
- Admins can manage Departments and Doctors but cannot create Medical Records.
- Department CRUD is admin-only — Doctors and Patients should not see department management UI.
- Avatar upload is available to all roles for their own profile.
- Appointment status transitions are restricted: only the assigned Doctor or Admin can confirm/complete; only the Patient or Admin can cancel.

## Terminology

- **Slot** — a time window in a Doctor's schedule that is available for booking.
- **Record** — shorthand for Medical Record throughout the codebase and UI.
- **Status** — the lifecycle state of an Appointment (`pending`, `confirmed`, `completed`, `cancelled`).
