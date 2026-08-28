---
trigger: always_on
---

# DATABASE & DATA DOMAIN RULES

## 🚨 MANDATORY INSTRUCTION
Before writing Prisma schemas (`prisma/schema.prisma`), Zod schemas (`schemas/`), or Server Actions (`actions/`), ensure you adhere to the domain entities specified below.

---

## 🗄️ CORE DOMAIN ENTITIES

### 1. Booking & Scheduling Domain
- **Entity:** `Booking`, `SlotAvailability`, `MeetingNote`
- **Rules:**
  - Booking status: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`, `COMPLETED`.
  - Cancellations or reschedule requests MUST be restricted if less than 24 hours before the session.
  - Mandatory fields for meeting notes: Session feedback, recommendations, action plan.

### 2. Document Tracking Domain
- **Entity:** `StudentDocument`, `DocumentStatusLog`
- **Rules:**
  - Status sequence: `UPLOADED` ➔ `VERIFICATION` ➔ `PROCESSING` ➔ `APPROVED` / `REVISION_REQUIRED`.
  - Must support revision feedback notes from the Document Processor department.

### 3. Staff Attendance Domain
- **Entity:** `Attendance`, `LeaveRequest`
- **Rules:** Includes `clockIn`, `clockOut`, status (`PRESENT`, `LATE`, `LEAVE`), and approval status from HR/Management.

### 4. Payroll Domain
- **Entity:** `Payroll`, `Payslip`
- **Rules:**
  - Auto-calculates base salary + incentives per conducted session - deductions.
  - Payslips MUST be generated as PDF and restricted strictly to individual owners and HR/Management.