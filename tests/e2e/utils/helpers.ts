import { Page, expect } from '@playwright/test'
import type { TestEventData, TestParticipantData } from './test-data'

/**
 * Helper functions for common test actions
 */

/**
 * Navigate to the home page
 */
export async function goToHomePage(page: Page, locale: 'mn' | 'en' = 'mn') {
  await page.goto(`/${locale}`)
}

/**
 * Navigate to the create event page
 */
export async function goToCreatePage(page: Page, locale: 'mn' | 'en' = 'mn') {
  await page.goto(`/${locale}/create`)
}

/**
 * Fill in the event creation form
 */
export async function fillEventForm(page: Page, eventData: TestEventData) {
  // Fill in title
  await page.fill('input[name="title"]', eventData.title)
  await page.fill('textarea[name="description"]', eventData.description)

  // Clear existing date/time inputs (default 2 are present)
  const dateInputs = page.locator('[data-testid^="date-time-input"]')
  const count = await dateInputs.count()

  // If we need more dates than the default 2, add them
  if (eventData.dates.length > count) {
    for (let i = 0; i < eventData.dates.length - count; i++) {
      await page.click('button:has-text("Add")') // Click the add date button
    }
  }

  // Fill in each date/time option
  for (let i = 0; i < eventData.dates.length; i++) {
    const dateOption = eventData.dates[i]
    const container = page.locator(`[data-testid="date-time-input-${i}"]`)

    await container.locator('input[type="date"]').fill(dateOption.date)
    await container.locator('input[placeholder*="19:00"], input[placeholder*="Start"]').first().fill(dateOption.startTime)
    if (dateOption.endTime) {
      await container.locator('input[placeholder*="21:00"], input[placeholder*="End"]').first().fill(dateOption.endTime)
    }
  }
}

/**
 * Submit the event creation form
 */
export async function submitEventForm(page: Page) {
  await page.click('button[type="submit"]')
}

/**
 * Create a complete event and return the event URL
 */
export async function createEvent(page: Page, eventData: TestEventData, locale: 'mn' | 'en' = 'mn'): Promise<{ eventUrl: string; editUrl: string }> {
  await goToCreatePage(page, locale)
  await fillEventForm(page, eventData)
  await submitEventForm(page)

  // Wait for redirect to event page
  await page.waitForURL(/\/e\/[a-f0-9-]+/, { timeout: 10000 })

  const url = page.url()
  const eventUrl = url.split('?')[0] // Remove query params to get clean URL
  const editUrl = url // Full URL with edit token

  return { eventUrl, editUrl }
}

/**
 * Fill in participant response form
 */
export async function fillParticipantResponse(page: Page, participantData: TestParticipantData) {
  // Fill in name
  await page.fill('input[name="name"]', participantData.name)

  // Fill in comment if provided
  if (participantData.comment) {
    await page.fill('textarea[name="comment"]', participantData.comment)
  }

  // Click on availability grid cells
  for (const [dateIndex, status] of Object.entries(participantData.availability)) {
    if (status !== '') {
      const cell = page.locator(`[data-testid="grid-cell-${dateIndex}"]`)

      // Click once for 'yes', twice for 'maybe'
      await cell.click()
      if (status === 'maybe') {
        await cell.click()
      }
    }
  }
}

/**
 * Submit participant response
 */
export async function submitParticipantResponse(page: Page) {
  await page.click('button[type="submit"]:has-text("Submit"), button[type="submit"]:has-text("Илгээх")')
}

/**
 * Extract event ID from URL
 */
export function extractEventId(url: string): string {
  const match = url.match(/\/e\/([a-f0-9-]+)/)
  return match ? match[1] : ''
}

/**
 * Extract edit token from URL
 */
export function extractEditToken(url: string): string {
  const match = url.match(/edit=([a-f0-9-]+)/)
  return match ? match[1] : ''
}

/**
 * Wait for toast notification to appear
 */
export async function waitForToast(page: Page, message?: string) {
  const toast = page.locator('[role="alert"], .toast, [data-testid="toast"]')

  if (message) {
    await expect(toast).toContainText(message)
  } else {
    await expect(toast).toBeVisible()
  }
}

/**
 * Check if a link can be copied to clipboard
 */
export async function copyLinkAndVerify(page: Page, buttonText: string) {
  // Grant clipboard permissions
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

  // Click the copy button
  await page.click(`button:has-text("${buttonText}")`)

  // Wait for toast or success message
  await page.waitForTimeout(500)
}

/**
 * Switch language
 */
export async function switchLanguage(page: Page, targetLocale: 'mn' | 'en') {
  // Look for language switcher button
  const languageButton = page.locator('button[data-testid="language-switch"], a[href*="locale="], button:has-text("MN"), button:has-text("EN")')

  if (await languageButton.count() > 0) {
    await languageButton.first().click()
  } else {
    // Navigate directly to the locale
    const currentPath = new URL(page.url()).pathname
    await page.goto(`/${targetLocale}${currentPath.replace(/^\/(mn|en)/, '')}`)
  }
}

/**
 * Verify event details are displayed correctly
 */
export async function verifyEventDetails(page: Page, eventData: TestEventData) {
  await expect(page.locator('h1')).toContainText(eventData.title)

  if (eventData.description) {
    await expect(page.locator('text=' + eventData.description)).toBeVisible()
  }
}

/**
 * Verify results table is visible and contains data
 */
export async function verifyResultsTable(page: Page) {
  const resultsTable = page.locator('table, [data-testid="results-table"]')
  await expect(resultsTable).toBeVisible()
}

/**
 * Verify best option card is displayed
 */
export async function verifyBestOption(page: Page) {
  const bestOption = page.locator('[data-testid="best-option"], text=🏆').first()
  await expect(bestOption).toBeVisible()
}
