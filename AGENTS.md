# Agent Developer Workflow Guide (for AmazonQ, Claude, Codex, Tab, Gemini, etc)

This document contains specific instructions for AI agents working on this codebase.

## TypeScript Validation

- **Before committing**: Always run TypeScript check on modified packages
- **Command**: `cd packages/<package-name> && pnpm typecheck` (or `pnpm exec tsc --noEmit`)
- **Note**: Never use `npx tsc` - it downloads a joke package. Use `pnpm typecheck` or `pnpm exec tsc`
- **Fix all errors**: Never commit code with TypeScript errors

## Commit Frequently

- **After each logical unit of work**: Create a git commit when completing a feature, fixing a bug, or adding documentation
- **Before risky operations**: Commit before refactoring, major changes, or experimental work
- **When switching contexts**: Commit before moving to a different task or file

## Commit Message Format

```bash
git add .
git commit -m "type: brief description

- Detail 1
- Detail 2"
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Progress Tracking Pattern

1. **Plan**: Break work into small, committable steps
2. **Implement**: Complete one step at a time
3. **Verify**: Test the change works
4. **Commit**: Save progress with descriptive message
5. **Repeat**: Move to next step

## Example Workflow

```bash
# Step 1: Add new resource parser
git add packages/api/src/arn-parser.ts
git commit -m "feat: add DynamoDB resource parsing support"

# Step 2: Add tests
git add packages/api/src/__tests__/
git commit -m "test: add DynamoDB parser tests"

# Step 3: Update documentation
git add packages/api/README.md
git commit -m "docs: document DynamoDB BARN support"
```

## Recovery

If progress is lost, use `git log` and `git reflog` to recover previous work.

## Code Style

- Write minimal, focused code that directly addresses requirements
- Avoid verbose implementations
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Leverage Biome for formatting and linting
