# @arch-navigator/electron

Electron desktop wrapper for Architecture Navigator.

## Purpose

Provides a native desktop application experience by wrapping the web application in Electron. Enables:

- Native OS integration
- Offline capabilities
- System-level features
- Desktop distribution

## Structure

```
src/           # Electron main process code
dist/          # Compiled TypeScript
dist-electron/ # Packaged desktop application
```

## Development

```bash
# Terminal 1: Start web dev server
pnpm dev:web

# Terminal 2: Launch Electron in development mode
NODE_ENV=development pnpm dev:electron
```

Development mode features:

- Loads web app from dev server (http://localhost:5173)
- Hot reload for main process changes
- Chrome DevTools for debugging (Cmd+Option+I)

## Building

```bash
# Build desktop application
pnpm build:electron
```

This command:

1. Builds the web application (`@arch-navigator/web`)
2. Compiles TypeScript main process code
3. Packages the application with electron-builder

Output is generated in `dist-electron/` with platform-specific installers.

## Configuration

### electron-builder

Configured in `package.json` under `build` key:

- **productName**: Application display name
- **appId**: Unique application identifier
- **files**: Files to include in the package
- **directories**: Build output location

The configuration bundles:

- Compiled main process (`dist/`)
- Web application build (`../web/dist`)

### Main Process

The main process (`src/main.ts`) handles:

- Window creation and management
- Native OS integration
- IPC communication with renderer
- Application lifecycle

## Architecture

```
┌─────────────────────────────────────┐
│   Electron Main Process (Node.js)  │
│   - Window management               │
│   - Native APIs                     │
│   - IPC handlers                    │
└──────────────┬──────────────────────┘
               │
               │ IPC
               │
┌──────────────▼──────────────────────┐
│   Renderer Process (Chromium)      │
│   - Web application                 │
│   - SolidJS UI                      │
│   - BARN API integration            │
└─────────────────────────────────────┘
```

## Dependencies

- **electron**: Desktop application framework
- **electron-builder**: Application packaging and distribution
- **typescript**: Type-safe development
- **@types/node**: Node.js type definitions

## Distribution

Built applications can be distributed as:

- DMG (macOS)
- EXE installer (Windows)
- AppImage/DEB/RPM (Linux)

## Debugging

### Main Process

- Use `console.log` for simple debugging
- Attach Node.js debugger for advanced debugging
- Check terminal output for errors

### Renderer Process

- Open DevTools: Cmd+Option+I (macOS) or Ctrl+Shift+I (Windows/Linux)
- Use browser debugging tools
- Inspect network requests and console logs

## Best Practices

- Keep main process logic minimal
- Use IPC for main-renderer communication
- Handle window lifecycle events properly
- Test on target platforms before release
- Sign applications for distribution
