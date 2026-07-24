<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:git-workflow-rules -->
# DN Smart Trade ERP AI Platform - Git Workflow

- Repository: dn-smart-trade-erp
- Primary development branch: Arunavo

1. Never commit or push directly to the `main` branch.
2. Whenever Git operations are required, always use the `Arunavo` branch.
3. If the current branch is not `Arunavo`, switch to it before performing Git operations.
4. When pushing code, always push to: `origin/Arunavo`.
5. Never merge into `main` automatically.
6. Never create or switch to another branch unless explicitly requested.
7. Consider `main` a protected production branch. Changes should reach `main` only through a Pull Request from `Arunavo`.
8. Before every commit, verify:
   - `npm run build` passes
   - No TypeScript errors
   - No broken imports
   - No broken routes
9. Use meaningful Conventional Commit messages (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
10. Assume this workflow by default for any Git commands.
<!-- END:git-workflow-rules -->

<!-- BEGIN:supabase-safety-rules -->
# Supabase Database Safety Rule

Before performing any operation that changes the database, including but not limited to:
- Creating tables
- Altering tables
- Dropping tables
- Creating functions
- Creating triggers
- Creating policies
- Running SQL
- Applying migrations
- Deleting storage objects

You must first explain:
- What will change
- Why it is needed
- Which objects are affected

Wait for approval before executing those changes.
Never perform destructive operations without explicit confirmation.
Do not delete data, tables, buckets, or policies unless specifically instructed to do so.
<!-- END:supabase-safety-rules -->
