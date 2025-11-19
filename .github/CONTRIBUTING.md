# Contributing to Project Lavos

Thank you for your interest in contributing! This guide will help you get started.

## Reporting Issues

We use GitHub Issues to track bugs and feature requests. When creating an issue, please use one of our templates:

### Bug Reports
Use the **Bug Report** template to report:
- UI/UX issues
- Functionality problems
- Browser compatibility issues
- Performance problems

Include:
- Which subdomain is affected
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information
- Screenshots if applicable

### Feature Requests
Use the **Feature Request** template to suggest:
- New features
- Enhancements to existing features
- UX improvements

Include:
- Problem statement (what pain point does this solve?)
- Proposed solution
- Priority level
- Who would benefit

### Test Failures
Use the **Test Failure** template to report:
- Failing E2E tests
- Flaky tests
- Test configuration issues

Include:
- Test file and name
- Error message
- Failure consistency (always, intermittent, CI-only)
- Link to GitHub Actions run

## Development Workflow

### Setup

```bash
# Clone the repository
git clone https://github.com/guitargnarr/projectlavos-monorepo.git
cd projectlavos-monorepo

# Install dependencies (each subdomain)
cd services/guitar
npm install

# Install E2E test dependencies
cd ../..
npm install
npx playwright install chromium webkit
```

### Running Tests

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/specs/guitar-navigation.spec.js

# Run in UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# View test report
npx playwright show-report
```

### Code Style

- **React + Vite** for frontend
- **Tailwind CSS v3** (NOT v4)
- **PropTypes** for component validation
- **Conventional Commits** for commit messages

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(guitar): Add favorites functionality to catalog
fix(navigation): Resolve mobile menu z-index issue
docs: Update README with deployment instructions
test(e2e): Add tests for Tab Player playback
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, modular code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test locally**
   ```bash
   npm run build && npm run preview
   npx playwright test
   ```

4. **Commit with conventional format**
   ```bash
   git add .
   git commit -m "feat(guitar): Add your feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub

6. **PR will automatically:**
   - Run E2E tests
   - Check for merge conflicts
   - Deploy preview to Vercel
   - Generate test report

7. **Wait for review**
   - Address any feedback
   - Make requested changes
   - Tests must pass before merge

## Testing Guidelines

### E2E Tests

- Tests run automatically on PR
- Must pass before merge
- Located in `tests/specs/`
- Use Playwright for all E2E tests

**Writing good tests:**
```javascript
test('should do something specific', async ({ page }) => {
  // Arrange
  await page.goto('/path');

  // Act
  await page.click('button.action');

  // Assert
  await expect(page.locator('.result')).toBeVisible();
});
```

### Test Best Practices

- Use descriptive test names
- Test one thing per test
- Use appropriate waitFor strategies
- Add screenshots on failure
- Keep tests independent
- Clean up after tests

## Architecture

### Subdomain Structure

```
.
├── main-site/          # projectlavos.com
├── demos/              # demos.projectlavos.com
├── about/              # about.projectlavos.com
└── services/
    └── guitar/         # guitar.projectlavos.com
```

### Guitar Platform Structure

```
services/guitar/
├── src/
│   ├── components/     # React components
│   │   ├── catalog/    # Catalog-specific components
│   │   ├── App.jsx
│   │   ├── Navigation.jsx
│   │   ├── TabPlayer.jsx
│   │   └── ...
│   └── main.jsx
├── public/            # Static assets
└── tests/             # Component tests
```

## Deployment

- **Automatic**: Push to `main` triggers deployment
- **Path-filtered**: Only changed subdomains deploy
- **Preview**: PRs get preview deployments
- **Vercel**: All subdomains deployed to Vercel

## Getting Help

- **Issues**: https://github.com/guitargnarr/projectlavos-monorepo/issues
- **Discussions**: Coming soon
- **Email**: matthewdscott7@gmail.com

## License

This project is private. Contact the owner for licensing information.

---

**Thank you for contributing to Project Lavos!**
