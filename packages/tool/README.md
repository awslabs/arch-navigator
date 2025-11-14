# @arch-navigator/tool

Core application logic package for cloud resource management.

## Purpose

This package contains the main application logic and orchestrates interactions between:
- UI components from `@arch-navigator/ui`
- Cloud resource management from `@arch-navigator/api`
- Application state and business rules

## Structure

```
src/
└── App.tsx    # Main application component
```

## Usage

This package is consumed by the web and Electron applications:

```typescript
import App from '@arch-navigator/tool';
```

## Dependencies

- **@arch-navigator/ui**: Shared UI component library
- **solid-js**: Reactive UI framework
- **zod**: Runtime type validation

## Development

```bash
# Type checking
pnpm lint
```

## Integration

The package is referenced in consuming applications via workspace protocol:

```json
{
  "dependencies": {
    "@arch-navigator/tool": "workspace:*"
  }
}
```
