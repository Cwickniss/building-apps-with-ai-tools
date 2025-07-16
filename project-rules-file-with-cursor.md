:
Prajwal Tomar
@PrajwalTomar_
·
·
Apr 16
1. Why .cursorrules wasn’t enough

Cursor originally used a single .cursorrules file at the root of a project, but this approach had serious problems:

Limited control
→ One rules file applied to the entire project, even when irrelevant.

Context overload
→ Cursor had to process every rule at once, often leading to ignored or misunderstood instructions.

Lack of scalability
→ As projects grew, .cursorrules became bloated and hard to manage.

Inconsistent AI responses
→ The AI often skipped or misapplied rules because the file lacked structure and precision.

Instead of improving code, .cursorrules often caused unpredictable results.
Prajwal Tomar
@PrajwalTomar_
·
·
Apr 16
1. Why .cursorrules wasn’t enough

Cursor originally used a single .cursorrules file at the root of a project, but this approach had serious problems:

Limited control
→ One rules file applied to the entire project, even when irrelevant.

Context overload
→ Cursor had to process every rule at once, often leading to ignored or misunderstood instructions.

Lack of scalability
→ As projects grew, .cursorrules became bloated and hard to manage.

Inconsistent AI responses
→ The AI often skipped or misapplied rules because the file lacked structure and precision.

Instead of improving code, .cursorrules often caused unpredictable results.
Prajwal Tomar
@PrajwalTomar_
·
·
Apr 16
2. Introducing Cursor’s Project Rules (.mdc files)

Cursor solved all of this by introducing Project Rules, stored as modular .mdc files inside .cursor/rules/.

This lets you apply rules per file type, module, or feature, not one giant file.

Why Project Rules are better:

Granular control
→ Rules are split into smaller, targeted files for specific contexts.

Better AI-generated code
→ Cursor loads only relevant rules, improving consistency and accuracy.

Easier rule management
→ Modular rules are easier to edit, scale, and maintain without breaking unrelated parts.

The result: fewer ignored rules, smarter AI, and a cleaner workflow.
Prajwal Tomar
@PrajwalTomar_
·
·
Apr 16
3. Step-by-step setup

Here’s how to set up Project Rules the right way:
Prajwal Tomar
@PrajwalTomar_
·
·
Apr 16
Step 1: General Rules (general.mdc)

This rule applies to all files across the project.

Scope: * (all files)

Contents:
- Use TypeScript for all development.
- Prioritize readability and maintainability.
- Use clear, descriptive names.
- Add meaningful comments for complexーーー

Description: General Guidelines Globs: *

# General Coding Guidelines - Use TypeScript for all frontend components. - Always provide concise comments explaining complex logic. - Prioritize readability and maintainability.
Prajwal Tomar
@PrajwalTomar_
·
·
Apr 16
Step 1: General Rules (general.mdc)

This rule applies to all files across the project.

Scope: * (all files)

Contents:
- Use TypeScript for all development.
- Prioritize readability and maintainability.
- Use clear, descriptive names.
- Add meaningful comments for complex logic.
Prajwal Tomar
@PrajwalTomar_
·
·
Apr 16
Step 2: Frontend Rules (frontend.mdc)

These rules apply only to frontend files (.tsx).

Scope: *.tsx (React components)

Contents:
- Use functional React components.
- Apply Tailwind CSS; avoid inline styles.
- Components should be modular and reusable.
- Maintain a consistent structure.———

Description: Frontend Coding Standards Globs: **/*tsx ーーー

# Frontend Guidelines

- Always prefer functional React components (no class components).

- Use Tailwind CSS utility classes consistently. - Avoid inline styles; use CSS modules if custom styles are necessary Comnanonte chould have clear daccrintiva namina.Step 3: Backend Rules (backend.mdc)

These rules apply only to backend logic (.ts API and database files).

Scope: api/**/*.ts (all backend API files)

Contents:
- Always validate API inputs.
- Use async/await consistently.
- Follow RESTful conventions.
- Optimize queries for performance.
- Log errors but avoid noisy debug logs in prod.
5. Best practices for Project Rules

To get the most out of .mdc:

Keep rules modular:
- Separate frontend, backend, and database logic.

Use precise scopes:
- .tsx → React components
- api/**/*.ts → Backend APIs
- */*.sql → SQL queries

Regularly refine rules:
- If a rule is too broad, break it into smaller, more specific rules.
- Review and adjust rules as the project evolves.

Use Global Rules for universal coding standards:
- Global standards (clean code, readability, comments, etc.) go in general.mdc.
- Project Rules apply to specific code sections (frontend, backend, etc.).