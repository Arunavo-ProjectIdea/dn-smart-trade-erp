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
