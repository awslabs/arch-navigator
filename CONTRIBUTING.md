# Contributing Guidelines

Thank you for your interest in contributing to our project. Whether it's a bug report, new feature, correction, or additional
documentation, we greatly value feedback and contributions from our community.

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary
information to effectively respond to your bug report or contribution.

## Reporting Bugs/Feature Requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check existing open, or recently closed, issues to make sure somebody else hasn't already
reported the issue. Please try to include as much information as you can. Details like these are incredibly useful:

- A reproducible test case or series of steps
- The version of our code being used
- Any modifications you've made relevant to the bug
- Anything unusual about your environment or deployment

## Contributing via Pull Requests

Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the _main_ branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

To send us a pull request, please:

1. Fork the repository.
2. Modify the source; please focus on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
3. Ensure local tests pass.
4. Commit to your fork using clear commit messages.
5. Send us a pull request, answering any default questions in the pull request interface.
6. Pay attention to any automated CI failures reported in the pull request, and stay involved in the conversation.

GitHub provides additional document on [forking a repository](https://help.github.com/articles/fork-a-repo/) and
[creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## Finding contributions to work on

Looking at the existing issues is a great way to find something to contribute on. As our projects, by default, use the default GitHub issue labels (enhancement/bug/duplicate/help wanted/invalid/question/wontfix), looking at any 'help wanted' issues is a great place to start.

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.

## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public github issue.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.

# Architecture Navigator Specifics

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/arch-navigator.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Prerequisites

- Node.js 24+
- pnpm (install via `npm install -g pnpm`)
- AWS credentials configured (for testing AWS features)

### Building

```bash
pnpm install        # Install all dependencies
pnpm build          # Build all packages
pnpm check          # Type check all packages
pnpm lint           # Lint code
pnpm format         # Format code
```

### Testing

```bash
pnpm dev:web        # Test web application
pnpm dev:electron   # Test desktop application
```

## Submitting Changes

### Pull Request Process

1. Ensure your code builds without errors: `pnpm build`
2. Run type checking: `pnpm check`
3. Run type checking: `pnpm lint`
4. Format your code: `pnpm format`
5. Commit your changes with clear messages
6. Push to your fork
7. Open a pull request with a clear description

### Commit Messages

Use conventional commit format:

```
type: brief description

- Detail 1
- Detail 2
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### Code Style

- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Write minimal, focused code
- Add comments for complex logic
- Update documentation for user-facing changes

## Adding New Features

### Cloud Provider Support

To add support for a new cloud provider:

1. Extend the BARN format in `packages/api`
2. Implement resource fetchers for the provider
3. Add relationship mapping logic
4. Update documentation

### UI Components

UI components live in `packages/ui`. Follow these guidelines:

- Use SolidJS patterns
- Keep components small and focused
- Add Storybook stories for visual testing
- Ensure accessibility compliance

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Search existing issues before creating new ones
- Provide clear reproduction steps for bugs
- Include environment details (OS, Node version, etc.)

## Questions?

- Open a [GitHub Discussion](https://github.com/awslabs/arch-navigator/discussions)
- Check existing documentation in the repository
