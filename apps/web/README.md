# @arch-navigator/web

Web browser application for AWS resource management.

## Purpose

Provides a browser-based interface for managing AWS resources using the BARN system. Built with SolidJS and Vite for fast development and optimal performance.

## Structure

```
src/           # Application source code
dist/          # Production build output
index.html     # HTML entry point
vite.config.ts # Vite configuration
```

## Development

```bash
# Start dev server with hot reload
pnpm dev:web
# Opens at http://localhost:5173
```

The dev server provides:
- Hot module replacement (HMR)
- Fast refresh for SolidJS components
- TypeScript type checking
- Instant updates on file changes

## Building

```bash
# Type check and build for production
pnpm build:web
```

Output is generated in `dist/` directory with:
- Optimized and minified JavaScript
- CSS extracted and minified
- Assets with content hashes for caching

## Dependencies

- **@arch-navigator/tool**: Core business logic
- **@arch-navigator/ui**: Shared UI components
- **solid-js**: Reactive UI framework
- **vite**: Build tool and dev server
- **vite-plugin-solid**: SolidJS integration for Vite

## Configuration

### Vite Config

`vite.config.ts` configures:
- SolidJS plugin for JSX transformation
- Build output directory
- Development server settings
- Asset handling

### TypeScript

`tsconfig.json` extends root configuration with web-specific settings.

## Integration with Electron

The Electron app (`@arch-navigator/electron`) bundles this web application's build output. When building Electron, this package is built first and included in the desktop app.

## Deployment

The built application can be:
- Served as a static website
- Bundled into the Electron desktop app
- Deployed to any static hosting service

## Best Practices

- Keep components reactive using SolidJS patterns
- Use workspace packages for shared code
- Leverage Vite's fast HMR during development
- Run type checking before committing
