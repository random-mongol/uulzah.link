import { test as base } from '@playwright/test'
import { getBasicEventData, getMultiDateEventData, getMongolianEventData } from '../utils/test-data'
import { createEvent } from '../utils/helpers'

/**
 * Custom fixtures for Playwright tests
 * Fixtures provide reusable setup and teardown logic
 */

type TestFixtures = {
  // Pre-created event fixture for tests that need an existing event
  existingEvent: {
    eventUrl: string
    editUrl: string
    eventData: ReturnType<typeof getBasicEventData>
  }
}

/**
 * Extend Playwright test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  // Fixture to create an event before the test
  existingEvent: async ({ page }, use) => {
    const eventData = getBasicEventData()
    const { eventUrl, editUrl } = await createEvent(page, eventData, 'mn')

    await use({ eventUrl, editUrl, eventData })

    // Cleanup: Events are stored in database, but for E2E tests
    // we rely on test database cleanup or isolation
  },
})

export { expect } from '@playwright/test'
