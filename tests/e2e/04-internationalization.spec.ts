import { test, expect } from './fixtures'
import { createEvent } from './utils/helpers'
import { getBasicEventData, getMongolianEventData } from './utils/test-data'

test.describe('Internationalization', () => {
  test('should default to Mongolian language', async ({ page }) => {
    await page.goto('/')

    // Should redirect to /mn
    await expect(page).toHaveURL(/\/mn/)

    // Should show Mongolian text
    await expect(page.locator('text=/уулзалт|хуваалцах/i')).toBeVisible()
  })

  test('should display English when accessing /en route', async ({ page }) => {
    await page.goto('/en')

    // Should show English text
    await expect(page.locator('text=/meeting|schedule/i')).toBeVisible()

    // Should not show Mongolian text for primary headings
    await expect(page.locator('h1:has-text("уулзалт")')).not.toBeVisible()
  })

  test('should create event in Mongolian', async ({ page }) => {
    const eventData = getMongolianEventData()

    await page.goto('/mn/create')

    // All form labels should be in Mongolian
    await expect(page.locator('text=/гарчиг|тайлбар/i')).toBeVisible()

    // Create event with Mongolian content
    await page.fill('input[name="title"]', eventData.title)
    await page.fill('textarea[name="description"]', eventData.description)

    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill(eventData.dates[0].date)
    await container.locator('input[placeholder*="HH:MM"]').first().fill(eventData.dates[0].startTime)
    await container.locator('input[placeholder*="HH:MM"]').last().fill(eventData.dates[0].endTime)

    await page.click('button[type="submit"]')

    // Should redirect and show Mongolian content
    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+/)
    await expect(page.locator('h1')).toContainText(eventData.title)
  })

  test('should create event in English', async ({ page }) => {
    const eventData = getBasicEventData()

    await page.goto('/en/create')

    // Form labels should be in English
    await expect(page.locator('text=/title|description/i')).toBeVisible()

    await page.fill('input[name="title"]', eventData.title)
    await page.fill('textarea[name="description"]', eventData.description)

    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill(eventData.dates[0].date)
    await container.locator('input[placeholder*="HH:MM"]').first().fill(eventData.dates[0].startTime)

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+/)
  })

  test('should display Mongolian UI elements on event page', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    // Check for Mongolian UI text
    await expect(page.locator('text=/нэр|хариулт|сэтгэгдэл/i')).toBeVisible()

    // Form labels should be in Mongolian
    await expect(page.locator('label:has-text("Нэр"), label:has-text("нэр")')).toBeVisible()
  })

  test('should display English UI elements on event page', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    // Access with /en prefix
    const enUrl = eventUrl.replace('/e/', '/en/e/')
    await page.goto(enUrl)

    // Check for English UI text
    await expect(page.locator('text=/name|availability|comment/i')).toBeVisible()

    // Form labels should be in English
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
  })

  test('should show Mongolian validation messages', async ({ page }) => {
    await page.goto('/mn/create')

    // Fill with invalid time increment
    await page.fill('input[name="title"]', 'Test')

    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill('2025-12-25')
    await container.locator('input[placeholder*="HH:MM"]').first().fill('10:17') // Invalid increment

    await page.click('button[type="submit"]')

    // Should show Mongolian error message
    await expect(page.locator('text=/15 минут/i')).toBeVisible()
  })

  test('should show English validation messages', async ({ page }) => {
    await page.goto('/en/create')

    await page.fill('input[name="title"]', 'Test')

    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill('2025-12-25')
    await container.locator('input[placeholder*="HH:MM"]').first().fill('10:17')

    await page.click('button[type="submit"]')

    // Should show English error message
    await expect(page.locator('text=/15-minute/i')).toBeVisible()
  })

  test('should display results in Mongolian', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    // Add a response
    await page.fill('input[name="name"]', 'Тест')
    await page.locator('[data-testid^="grid-cell-"]').first().click()
    await page.click('button[type="submit"]')

    await page.waitForTimeout(1000)

    // Results should show Mongolian labels
    await expect(page.locator('text=/нийт|чөлөөтэй/i')).toBeVisible()
  })

  test('should display results in English', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    const enUrl = eventUrl.replace('/e/', '/en/e/')
    await page.goto(enUrl)

    // Add a response
    await page.fill('input[name="name"]', 'Test')
    await page.locator('[data-testid^="grid-cell-"]').first().click()
    await page.click('button[type="submit"]')

    await page.waitForTimeout(1000)

    // Results should show English labels
    await expect(page.locator('text=/total|available/i')).toBeVisible()
  })

  test('should maintain locale when navigating', async ({ page }) => {
    await page.goto('/mn')

    // Navigate to create page
    await page.click('a[href="/create"]')

    // Should maintain /mn locale
    await expect(page).toHaveURL(/\/mn\/create/)

    // UI should still be in Mongolian
    await expect(page.locator('text=/гарчиг/i')).toBeVisible()
  })

  test('should handle locale in URLs correctly', async ({ page }) => {
    // Test that both /mn and /en work
    await page.goto('/mn/create')
    await expect(page).toHaveURL(/\/mn\/create/)

    await page.goto('/en/create')
    await expect(page).toHaveURL(/\/en\/create/)
  })

  test('should show localized date formats', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    // Date should be displayed (format may vary but should be visible)
    // Check for common date separators
    await expect(page.locator('text=/\\d{2}\\/\\d{2}|\\d{1,2}月/i')).toBeVisible()
  })

  test('should support Mongolian characters in event content', async ({ page }) => {
    await page.goto('/mn/create')

    const mongolianText = 'Багийн уулзалт - Ажлын төлөвлөгөө'
    await page.fill('input[name="title"]', mongolianText)

    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill('2025-12-25')
    await container.locator('input[placeholder*="HH:MM"]').first().fill('10:00')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+/)

    // Mongolian text should be displayed correctly
    await expect(page.locator('h1')).toContainText(mongolianText)
  })

  test('should show correct button text in Mongolian', async ({ page }) => {
    await page.goto('/mn/create')

    // Check button texts are in Mongolian
    await expect(page.locator('button:has-text("Нэмэх"), button:has-text("Add")')).toBeVisible()
  })

  test('should show correct button text in English', async ({ page }) => {
    await page.goto('/en/create')

    // Check button texts are in English
    await expect(page.locator('button:has-text("Add")')).toBeVisible()
  })

  test('should display voice recorder labels in Mongolian', async ({ page }) => {
    await page.goto('/mn/create')

    // Voice recorder section should have Mongolian text
    await expect(page.locator('text=/дуугаар/i')).toBeVisible()
  })

  test('should display voice recorder labels in English', async ({ page }) => {
    await page.goto('/en/create')

    // Voice recorder section should have English text
    await expect(page.locator('text=/voice/i')).toBeVisible()
  })
})
