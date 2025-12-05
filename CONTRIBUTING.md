# Contributing Guide

## Git Commit Standards

All commits must follow the conventional commit format:

### Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `ui:` - UI improvement
- `refactor:` - Code refactoring
- `chore:` - Repository maintenance (dependencies, config, etc.)
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `perf:` - Performance improvements

### Examples

```bash
feat: add course comparison feature
fix: resolve OTP verification issue
ui: improve mobile responsiveness
refactor: optimize database queries
chore: update dependencies
docs: add API documentation
```

### Commit Message Format

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

### Examples

```bash
# Simple commit
git commit -m "feat: add user dashboard"

# Detailed commit
git commit -m "feat: add AI course recommendations

- Implement AI filtering service
- Add recommendation endpoint
- Update frontend to display recommendations"

# Fix with issue reference
git commit -m "fix: resolve CORS error

Fixes #123"
```

## Branch Naming

- `main` - Production branch
- `develop` - Development branch
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `ui/component-name` - UI changes

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes following code style
3. Commit using conventional commit format
4. Push to your fork
5. Create a pull request with clear description
6. Ensure all tests pass
7. Request review from maintainers

## Code Style

### Backend (JavaScript)
- Use ES6+ features
- Follow async/await pattern
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions focused and small

### Frontend (React)
- Use functional components
- Follow React hooks best practices
- Use meaningful component names
- Keep components small and reusable
- Use TailwindCSS for styling

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers/devices
- Test API endpoints with Postman

## Questions?

Feel free to open an issue for questions or clarifications.

