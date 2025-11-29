# Project Lavos

![E2E Tests](https://github.com/guitargnarr/projectlavos-monorepo/actions/workflows/e2e-tests.yml/badge.svg)
![Deploy](https://github.com/guitargnarr/projectlavos-monorepo/actions/workflows/deploy-all.yml/badge.svg)

Multi-site platform demonstrating AI-native development. Built by a solo developer orchestrating Claude Code to ship production-quality software at scale.

## Live Sites

| Site | URL | Description |
|------|-----|-------------|
| Main | [projectlavos.com](https://projectlavos.com) | Landing page and portfolio |
| Demos | [demos.projectlavos.com](https://demos.projectlavos.com) | Interactive AI demos (Restaurant Analyzer, Email Scorer) |
| About | [about.projectlavos.com](https://about.projectlavos.com) | Background and the 10-Hour Question |
| Guitar | [guitar.projectlavos.com](https://guitar.projectlavos.com) | Guitar learning platform with 7 tools |

## Guitar Platform Features

The guitar learning platform includes:

- **FretVision** - Interactive fretboard visualization
- **Tab Player** - Guitar Pro file playback with MIDI
- **Chord Dictionary** - 50+ chord shapes with audio
- **Tuner** - Chromatic pitch detection using Web Audio API
- **Metronome** - Tap tempo, time signatures, subdivisions
- **Catalog** - 120+ lessons with progress tracking

## Quick Start

```bash
# Clone and install
git clone https://github.com/guitargnarr/projectlavos-monorepo.git
cd projectlavos-monorepo
npm install

# Run guitar platform locally
cd services/guitar
npm install
npm run dev
# Opens at http://localhost:5173

# Run tests
cd ../..
npx playwright install chromium
npx playwright test
```

## Architecture

```
projectlavos-monorepo/
├── main-site/          # Landing page (Vite + React)
├── demos/              # AI demo applications
├── about/              # About page
├── services/
│   └── guitar/         # Guitar learning platform
│       ├── src/pages/  # 7 feature pages
│       └── public/     # Soundfonts, tabs, assets
├── tests/              # Playwright E2E tests
└── .github/workflows/  # CI/CD (deploy + test)
```

**Stack**: React, Vite, Tailwind CSS, Playwright, Vercel

## Deployment

All sites deploy automatically to Vercel on push to `main`:

```bash
# Manual deploy (if needed)
cd services/guitar
vercel --prod
```

## Testing

```bash
# Run all E2E tests
npx playwright test

# Run with UI
npx playwright test --ui

# Specific test file
npx playwright test guitar-navigation
```

**Coverage**: 76 tests across 4 browsers (Chrome, Safari, Mobile Chrome, Mobile Safari)

<details>
<summary>Test Categories</summary>

- **Guitar Navigation** - Route highlighting, page transitions, mobile responsive
- **Restaurant Analyzer** - Selection, analysis, error handling, retry
- **Mobile Responsiveness** - Touch targets, text sizing, layout stacking
- **Cross-Subdomain** - Navigation between all 4 subdomains
- **Error States** - API errors, timeouts, 500/404 handling

</details>

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Run tests: `npx playwright test`
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push and open a PR

## Documentation

- [Guitar Platform README](services/guitar/README.md)
- [Auth Setup](services/SETUP-AUTH.md)
- [Test Failures](TEST_FAILURES.md)
- [Open Issues](https://github.com/guitargnarr/projectlavos-monorepo/issues)

## License

MIT
