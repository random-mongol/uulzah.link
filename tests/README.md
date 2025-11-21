# E2E Tests for uulzah.link

This directory contains end-to-end tests for the uulzah.link scheduling application using Playwright.

## Overview

The test suite covers all major features and user flows:

1. **Event Creation** (`01-event-creation.spec.ts`)
   - Creating events with valid data
   - Adding/removing date options
   - Form validation (required fields, time increments, duplicates)
   - Auto-fill functionality
   - Voice recording UI presence
   - Loading states

2. **Participant Responses** (`02-participant-responses.spec.ts`)
   - Viewing event details
   - Submitting participant responses
   - Cycling through availability statuses (empty → yes → maybe → empty)
   - Displaying multiple participant responses
   - Best option calculation
   - Results table with totals
   - Error handling

3. **Event Editing** (`03-event-editing.spec.ts`)
   - Edit access control with tokens
   - Device fingerprint verification
   - Share dialog functionality
   - Copying share links
   - Updating event details
   - Restricted access messages
   - Form validation in edit mode

4. **Internationalization** (`04-internationalization.spec.ts`)
   - Default Mongolian language
   - English language support
   - Locale-specific UI elements
   - Validation messages in both languages
   - Mongolian character support
   - Localized date formats
   - URL locale handling

5. **Accessibility** (`05-accessibility.spec.ts`)
   - WCAG compliance using axe-core
   - Proper ARIA labels and roles
   - Keyboard navigation
   - Focus indicators
   - Color contrast
   - Heading hierarchy
   - Screen reader announcements
   - Required field markup

## Prerequisites

- Node.js 20+
- pnpm package manager
- Supabase instance configured (see `.env.local`)

## Installation

Install dependencies if not already installed:

```bash
pnpm install
```

Install Playwright browsers:

```bash
npx playwright install chromium
```

## Running Tests

### Run all tests (headless)
```bash
pnpm test
```

### Run tests with UI mode (interactive)
```bash
pnpm test:ui
```

### Run tests in headed mode (see browser)
```bash
pnpm test:headed
```

### Run specific test file
```bash
pnpm test tests/e2e/01-event-creation.spec.ts
```

### Debug tests
```bash
pnpm test:debug
```

### View test report
```bash
pnpm test:report
```

## Test Structure

```
tests/
├── e2e/
│   ├── fixtures/
│   │   └── index.ts          # Custom Playwright fixtures
│   ├── utils/
│   │   ├── test-data.ts      # Test data generators
│   │   └── helpers.ts        # Helper functions for common actions
│   ├── 01-event-creation.spec.ts
│   ├── 02-participant-responses.spec.ts
│   ├── 03-event-editing.spec.ts
│   ├── 04-internationalization.spec.ts
│   └── 05-accessibility.spec.ts
└── README.md                 # This file
```

## Test Data

Test data is generated dynamically using `date-fns` to ensure tests work regardless of when they're run. The `test-data.ts` file provides:

- `getBasicEventData()` - Standard 2-date event
- `getMultiDateEventData()` - Event with 5 dates
- `getMongolianEventData()` - Event with Mongolian text
- `getInvalidEventData()` - Invalid data for validation tests
- `getParticipantData()` - Participant response data

## Helper Functions

The `helpers.ts` file provides reusable functions:

- `createEvent()` - Creates a complete event and returns URLs
- `fillEventForm()` - Fills the event creation form
- `submitParticipantResponse()` - Submits a participant response
- `extractEventId()`, `extractEditToken()` - URL parsing utilities
- `waitForToast()` - Wait for toast notifications

## Fixtures

Custom Playwright fixtures in `fixtures/index.ts`:

- `locale` - Test with different languages (mn/en)
- `existingEvent` - Pre-created event for tests that need one

Usage:
```typescript
test('my test', async ({ page, locale, existingEvent }) => {
  // locale is 'mn' or 'en'
  // existingEvent has { eventUrl, editUrl, eventData }
})
```

## Configuration

Playwright configuration is in `/playwright.config.ts`:

- Tests run in Chromium by default
- Automatic dev server startup
- Screenshots on failure
- Trace on first retry
- HTML reporter for local development
- GitHub Actions reporter for CI

## Writing New Tests

1. Create a new spec file in `tests/e2e/`
2. Import fixtures: `import { test, expect } from './fixtures'`
3. Use helpers from `./utils/helpers`
4. Use test data from `./utils/test-data`
5. Follow existing naming conventions

Example:
```typescript
import { test, expect } from './fixtures'
import { createEvent } from './utils/helpers'
import { getBasicEventData } from './utils/test-data'

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    await page.goto(eventUrl)

    // Your test code here
  })
})
```

## Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Wait for network idle** before assertions when navigating
3. **Use helper functions** for common workflows
4. **Generate test data dynamically** to avoid date-dependent failures
5. **Test in both languages** when relevant
6. **Include accessibility tests** for new features
7. **Mock external services** when appropriate
8. **Clean up after tests** (though fixtures handle this)

## Troubleshooting

### Tests fail with "Address already in use"
The dev server might still be running. Kill it and let Playwright start it:
```bash
pkill -f "next dev"
pnpm test
```

### Tests fail with database errors
Ensure your Supabase instance is running and migrations are applied:
```bash
pnpm test:db
```

### Tests are flaky
- Increase timeouts for slow operations
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use more specific selectors
- Check for race conditions

### Can't find elements
- Check if data-testid was added to the component
- Verify the locale (mn vs en) matches expected text
- Use Playwright Inspector: `pnpm test:debug`

## CI/CD

Tests are designed to run in CI environments:

- Headless mode by default
- Retries on failure (2 retries in CI)
- GitHub Actions reporter
- Screenshots and traces on failure

Example GitHub Actions workflow:

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run tests
  run: pnpm test
  env:
    CI: true

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Coverage

Current test coverage includes:

- ✅ Event creation and validation
- ✅ Participant responses
- ✅ Event editing with access control
- ✅ Internationalization (mn/en)
- ✅ Accessibility (WCAG)
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Navigation flows

## Future Enhancements

Potential areas for additional testing:

- [ ] Voice recording functionality (requires audio mocking)
- [ ] Performance testing
- [ ] Mobile viewport testing
- [ ] Cross-browser testing (Firefox, Safari)
- [ ] Visual regression testing
- [ ] API testing
- [ ] Database state verification

## Contributing

When adding new features:

1. Write tests first (TDD) or alongside the feature
2. Ensure tests pass: `pnpm test`
3. Check accessibility: Review `05-accessibility.spec.ts` results
4. Test in both languages if UI changes are involved
5. Update this README if adding new test categories

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [axe-core Documentation](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
