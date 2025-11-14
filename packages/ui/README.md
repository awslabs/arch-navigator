# @arch-navigator/ui

Shared UI component library built with SolidJS and Tailwind CSS.

## Purpose

Provides reusable UI components used across web and Electron applications. Components are documented and developed in isolation using Storybook.

## Structure

```
src/
├── components/     # Reusable SolidJS components
│   └── *.tsx      # Individual component files
└── index.css      # Global Tailwind styles

.storybook/        # Storybook configuration
```

## Usage

```typescript
// Import individual components
import { Layout } from '@arch-navigator/ui/components/Layout';
import { ResourceTree } from '@arch-navigator/ui/components/ResourceTree';

// Import global styles
import '@arch-navigator/ui/styles';
```

## Development

### Storybook

View and develop components in isolation:

```bash
# Start Storybook dev server
pnpm dev:storybook
# Opens at http://localhost:6006

# Build static Storybook
pnpm build:storybook
```

### Styling

Tailwind CSS is configured at the root level. Global styles are in `src/index.css`.

## Dependencies

- **@arch-navigator/api**: Resource types and state
- **solid-js**: Reactive UI framework
- **tailwindcss**: Utility-first CSS framework
- **lucide-solid**: Icon library

## Integration

Referenced in consuming packages via workspace protocol:

```json
{
  "dependencies": {
    "@arch-navigator/ui": "workspace:*"
  }
}
```
