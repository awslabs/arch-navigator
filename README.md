> **⚠️ Early Development Notice**
> This project is in active development and may contain instabilities and security considerations. Exercise caution when using this tool, particularly in or around production environments.

# Architecture Navigator

A desktop application for navigating cloud infrastructure through a unified interface. Browse, inspect, and understand relationships between resources across AWS and other cloud providers.

## Features

- **Unified Resource View**: Navigate all your cloud resources in one place
- **Relationship Mapping**: Automatically discover and visualize resource dependencies
- **Multi-Cloud Support**: Currently supports AWS with extensible architecture for other providers
- **Desktop & Web**: Run as an Electron desktop app or in your browser
- **Credential Management**: Secure credential handling with automatic CLI integration

## Current Experience

- List all root CloudFormation stacks in expandable tree view.
- Select resource nodes to show details.

## Quick Start

> ⚡ **NB:** These usage patterns will evolve quickly as the project matures.

## Setup

### Prerequisites

- Node.js 24+ and pnpm
- Your default AWS CLI profile should be configured on your system
  - use the following command to verify your AWS CLI setup:
  ```bash
  aws cloudformation list-stacks --query "StackSummaries[?ParentId==null].StackName"
  ```
  - If AWS CLI is not configured, you can paste credential JSON directly in the application

### Installation

```bash
# Clone the repository
git clone https://github.com/awslabs/arch-navigator.git
cd arch-navigator

# Install dependencies
pnpm install

# Build packages
pnpm build

# Built artifacts available apps/electron/out/
```

#### Code Signing (MacOS)

The build process uses a rudimentary signing approach to enable cross-device builds. The sign script attempts to use an `arch-navigator-dev` certificate for code signing. If available in macOS Keychain, it will be used. Otherwise, the app will not be signed.

To create the certificate locally, in Keychain Access use 'Certificate Assistant' > 'Create a Certificate':
- **Name:** `arch-navigator-dev`
- **Identity Type:** `Self Signed Root`
- **Certificate Type:** `Code Signing`


### Running the Application in Dev Mode

**Web Application:**

```bash
pnpm dev:web
# Opens at http://localhost:5173
```

**Desktop Application (Development):**

```bash
pnpm dev:electron
# Opens app
```


## How It Works

Architecture Navigator uses a normalized resource representation called a **BARN**:

```typescript
{
  type: "AWS::EC2::Instance",
  identifier: "i-1234567890abcdef0",
  arn: "arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0"
}
```

This allows the application to work with resources from different cloud providers in a consistent way.

## Supported AWS Services

- EC2 (Instances, Security Groups, VPCs)
- IAM (Roles, Policies, Users)
- S3 (Buckets)
- Lambda (Functions)
- RDS (Database Instances)
- DynamoDB (Tables)
- SNS (Topics)
- SQS (Queues)
- ELB (Load Balancers)
- CloudFormation (Stacks)

## Architecture

```
apps/
├── web/              # Web application (SolidJS + Vite)
└── electron/         # Desktop wrapper

packages/
├── api/              # Cloud resource management
├── ui/               # Shared UI components
└── tool/             # Core application logic
```

## Development

### Project Structure

- **Monorepo**: Uses pnpm workspaces
- **TypeScript**: Strict mode enabled
- **Build System**: Turbo for orchestration
- **Code Quality**: Biome for linting and formatting

### Common Commands

```bash
# Development
pnpm dev:web              # Start web dev server
pnpm dev:electron         # Launch Electron app
pnpm dev:storybook        # Component documentation

# Building
pnpm build                # Build all packages
pnpm build:web            # Build web app only
pnpm build:electron       # Build desktop app

# Code Quality
pnpm lint                 # Lint all packages
pnpm format               # Format code
pnpm typecheck            # Type check all packages
```

### Adding Dependencies

```bash
# Add to specific workspace
pnpm --filter @arch-navigator/api add <package>

# Add dev dependency to root
pnpm add -D <package> -w
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/awslabs/arch-navigator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/awslabs/arch-navigator/discussions)

