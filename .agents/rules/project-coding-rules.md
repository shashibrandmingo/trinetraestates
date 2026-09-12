# Project Coding Rules & Standards

1. Use TypeScript throughout the project.
2. Follow the existing project architecture and folder structure.
3. Use Next.js Server Components by default.
4. Use Client Components only when client-side features are actually required.
5. Keep API calls inside the services layer.
6. Keep database queries inside the db/repository layer.
7. Never put database queries directly inside UI components.
8. Never duplicate business logic. Reuse existing functions/services.
9. Before creating a new component, utility, hook, service, or helper, check whether an existing one can be reused.
10. Keep reusable UI components inside the appropriate components folder.
11. Use Zod for validating API inputs, form inputs, and other external/untrusted data.
12. Keep validation schemas reusable and centralized where appropriate.
13. Keep TypeScript types/interfaces organized in the existing types structure.
14. Keep authentication and authorization logic centralized.
15. Do not hardcode secrets, API keys, URLs, or environment-specific values.
16. Use environment variables for configuration and secrets.
17. Follow existing naming conventions and coding patterns.
18. Do not introduce a new library/dependency unless it is actually necessary.
19. Before modifying existing code, understand how the related code currently works.
20. Make the smallest clean change necessary to solve the requirement.
21. Do not rewrite unrelated files or functionality.
22. Handle loading, error, empty, and success states where applicable.
23. Add proper error handling at API/service boundaries.
24. Keep components focused and avoid unnecessarily large files.
25. Do not blindly generate new files. First check the existing architecture and reuse what already exists.
26. After making changes, check for TypeScript errors, lint issues, broken imports, and obvious runtime problems.
27. If an architectural decision is unclear, explain the options before making a major structural change.
28. Maintain consistency with the existing project instead of introducing a completely different pattern.

IMPORTANT:
Before writing code, inspect the existing project structure and relevant files. 
Do not assume that a component, utility, service, API, schema, or function does not already exist.
Reuse existing code whenever possible.
