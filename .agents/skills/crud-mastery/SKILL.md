---
name: crud-mastery
description: Instructions and templates for creating new CRUD features based on the project's established patterns (Prisma + Server Actions + Shadcn UI).
---

# 🛠️ CRUD Mastery: The Ultimate Guide

This skill provides a systematic approach to creating new data-driven features in this starter kit. 

## 📋 Core Workflow

1. **Schema Definition**: Add your model to `prisma/schema.prisma`.
2. **Validation Schema**: Create a new file in `schemas/` using `schema-template.ts`.
3. **Server Actions**: Create logic in `app/actions/` using `action-template.ts`.
4. **Column Definitions**: Define your table columns in `components/columns/` using `columns-template.tsx`.
5. **Form Component**: Build your UI form using `form-template.tsx`.
6. **Dashboard Page**: Assemble the feature in `app/dashboard/` using `page-template.tsx` with the `DataTable` component.

## 📦 Reference Templates (`resources/`)

- `schema-template.ts`: Zod validation rules + Type export.
- `action-template.ts`: Type-safe Server Actions.
- `columns-template.tsx`: TanStack Table column definitions.
- `form-template.tsx`: Shadcn UI form with Zod Resolver.
- `page-template.tsx`: Dashboard layout with `DataTable` integration.
