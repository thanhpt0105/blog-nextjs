# Contributing to Personal Blog

Thank you for considering contributing to this project! Here are some guidelines to help you get started.

## How to Contribute

### Reporting Bugs

- Use the GitHub Issues page to report bugs
- Describe the bug in detail
- Include steps to reproduce
- Provide screenshots if applicable

### Suggesting Features

- Open an issue with the "Feature Request" label
- Describe the feature and its use case
- Explain why this feature would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Write or update tests if applicable
5. Run the linter and type checker:
   ```bash
   npm run lint
   npm run type-check
   ```
6. Commit your changes with clear commit messages
7. Push to your fork
8. Open a Pull Request with a clear description

## Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Comment complex logic
- Keep components small and focused

## Testing

Before submitting a PR:
- Test your changes locally
- Ensure the build succeeds: `npm run build`
- Check for TypeScript errors: `npm run type-check`
- Run linting: `npm run lint`

## Questions?

Feel free to open an issue for any questions!
