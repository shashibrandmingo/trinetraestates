# PROJECT CODING RULES

## Core Principles

1. **TypeScript Throughout**: Use TypeScript across the entire project (`.ts`, `.tsx`) with strict types. Avoid `any`.
2. **Follow Existing Architecture**: Adhere strictly to the established directory structure and component hierarchy.
3. **Server Components by Default**: In Next.js App Router, all pages and components must be Server Components (`RSC`) by default.
4. **Client Components Only When Required**: Use `'use client'` strictly when client-side features are needed (e.g., hooks like `useState`, `useEffect`, browser event listeners, interactive UI toggles).
5. **Services Layer for API Calls**: All external and backend API communications must reside inside the centralized `services/` layer.
6. **Repository Layer for Database**: All MongoDB/Mongoose database queries must reside strictly inside the backend `controllers/` or `services/` / `repositories/` layer.
7. **No DB Queries in UI**: Never execute database queries directly inside frontend UI components.
8. **DRY (Don't Repeat Yourself)**: Never duplicate business logic. Reuse existing functions, utilities, and services.
9. **Reuse Check Before Creation**: Before creating a new component, utility, hook, service, or helper, check whether an existing one can be reused.
10. **Organized UI Components**: Place reusable UI components in their appropriate categorized directories (`components/common`, `components/office`, `components/admin`, etc.).
11. **Zod Validation**: Use Zod for validating API payloads, form submissions, query parameters, and untrusted external inputs.
12. **Centralized Validation Schemas**: Keep validation schemas reusable and centralized (e.g., `src/validations/`).
13. **Organized Types Structure**: Keep TypeScript types and interfaces organized inside `src/types/`.
14. **Centralized Auth & Security**: Keep authentication, JWT handling, session checks, and authorization guards centralized.
15. **Zero Hardcoded Secrets**: Never hardcode secrets, API keys, URLs, or environment-specific values in source code.
16. **Strict Environment Variables**: Read configuration, ports, and URLs strictly from `.env` files with strict validation.
17. **Naming Conventions**: Maintain consistent naming conventions (`camelCase` for variables/functions, `PascalCase` for components/types, `kebab-case` or descriptive names for files).
18. **Minimal Dependencies**: Do not introduce a new library or dependency unless strictly necessary.
19. **Context Awareness**: Before modifying existing code, thoroughly inspect and understand how the related code currently works.
20. **Surgical, Clean Changes**: Make the smallest clean change necessary to fulfill the requirement without breaking existing behavior.
21. **No Scope Creep**: Do not rewrite unrelated files or functionality.
22. **Comprehensive UI States**: Always handle `loading`, `error`, `empty`, and `success` states across views and components.
23. **Graceful Error Handling**: Add proper error handling and catch blocks at all API and service boundaries.
24. **Focused, Concise Files**: Keep components single-purpose and avoid unnecessarily large files (keep files modular and under ~150-200 lines where practical).
25. **Architectural Inspection First**: Do not blindly generate new files. Inspect existing architecture and reuse what already exists.
26. **Verification & Quality Gate**: After making changes, verify TypeScript errors, lint issues, broken imports, and runtime behavior.
27. **Architectural Clarity**: If an architectural decision is ambiguous or unclear, explain the options before making a major structural change.
28. **Pattern Consistency**: Maintain architectural consistency with the existing codebase rather than introducing conflicting paradigms.

---

## Pre-Implementation Checklist
- [ ] Inspected existing project structure and relevant files.
- [ ] Confirmed whether a reusable component, utility, service, or schema already exists.
- [ ] Used Server Components where interactivity is not required.
- [ ] Checked for TypeScript correctness (`npm run build` passes).
- [ ] Verified strict environment variable usage (no hardcoded fallback URLs).
