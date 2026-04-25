# CareSync — User Personas

## Admin

**Credentials:** admin@caresync.dev / Password123!

Can do everything in the platform:
- Create, update, delete Departments
- Create, update, delete Doctors and assign them to Departments
- View all Patients and their profiles
- View all Appointments across all Doctors and Patients
- View all Medical Records
- Download any file Attachment
- Update any user's profile

Cannot do:
- Create Medical Records (that's a Doctor-only action)
- Book Appointments (no Patient context)

Typical test journeys:
- Create a department → assign a doctor to it → verify doctor appears in department list
- View a patient's full appointment history
- Download an attachment from a record they did not create

---

## Doctor

**Credentials:** dr.smith@caresync.dev / Password123!

Can do:
- View and update own profile (including avatar)
- Manage own schedule — add/remove availability slots
- View all Patients (read-only list and profiles)
- Create Medical Records for their own Patients (only after appointment is completed)
- View Medical Records they created
- Upload and download file Attachments on their own records
- View their own Appointment list and update status (confirm, complete)

Cannot do:
- Manage Departments or other Doctors (admin-only)
- View Medical Records created by other Doctors
- Book Appointments on behalf of Patients

Typical test journeys:
- Set available slots → patient books → doctor confirms → doctor marks completed → doctor creates record
- Upload a PDF attachment to a Medical Record
- Attempt to access /departments → expect redirect or 403

---

## Patient

**Credentials:** john.doe@caresync.dev / Password123!

Can do:
- View and update own profile (including avatar)
- Browse available Doctors and their slots
- Book an Appointment with an available Doctor
- Cancel own pending Appointments
- View own Appointment history
- View own Medical Records (read-only)
- Download Attachments from own Medical Records

Cannot do:
- View other patients' data
- Create Medical Records
- Access any admin or doctor management pages
- Download attachments from records that don't belong to them

Typical test journeys:
- Browse doctors → select a slot → book appointment → verify it appears in appointment list
- View a completed appointment → see linked Medical Record
- Attempt to access /departments or /admin → expect redirect or access denied
