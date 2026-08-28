---
trigger: always_on
---

# RBAC & AUTHORIZATION RULES

## 🚨 MANDATORY INSTRUCTION
All Server Actions (`actions/`) and API routes MUST enforce strict Role-Based Access Control (RBAC) check before executing data mutations or returning Prisma queries.

---

## 👥 USER ROLES
1. **STUDENT** (Siswa)
2. **CONSULTANT** (Konsultan/Tutor)
3. **MANAGEMENT** (Manajemen & HR)
4. **DOCUMENT_PROCESSOR** (Departemen Pengolah Dokumen)

---

## 🛡️ ACCESS CONTROL MATRIX & PERMISSIONS

### 1. Student Portal (`app/(dashboard)/student/`)
- **Booking & Schedule:** Can `CREATE` bookings, `READ` own schedules, and `UPDATE` (reschedule/cancel max 24h prior).
- **Document Tracking:** Can `READ` own document status and `CREATE` (upload) required files. CANNOT update verification status.

### 2. Consultant Portal (`app/(dashboard)/consultant/`)
- **Availability:** Can `CREATE` and `UPDATE` own available slots.
- **Booking Management:** Can `READ` and `UPDATE` (approve/reject/reschedule) assigned student sessions.
- **Meeting Notes:** Can `CREATE` and `UPDATE` session feedback/notes.
- **Attendance:** Can `CREATE` self clock-in/out and submit leave requests.

### 3. Document Processor Panel (`app/(dashboard)/processor/`)
- **Document Management:** Has `WRITE/UPDATE` access to verify documents, update tracker status (`Uploaded` -> `Verification` -> `Processing` -> `Approved`), and input revision notes.

### 4. Management & HR Portal (`app/(dashboard)/admin/`)
- **Full Access:** Has full `CRUD` permissions across all modules (Analytics, Staff Attendance Approval, Payroll & Slip Salary PDF Generation).

---

## 🔒 ACTION SAFETY ENFORCEMENT
Every server action MUST include user session and role validation:

```typescript
// Example rule inside actions/
const session = await getAuthSession();
if (!session || session.user.role !== "DOCUMENT_PROCESSOR") {
  throw new Error("UNAUTHORIZED: Only Document Processors can update document status.");
}