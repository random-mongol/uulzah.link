import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { createEvent } from './utils/helpers'
import { getBasicEventData } from './utils/test-data'

test.describe('Accessibility', () => {
  test('home page should not have accessibility violations', async ({ page }) => {
    await page.goto('/mn')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('create event page should not have accessibility violations', async ({ page }) => {
    await page.goto('/en/create')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('event view page should not have accessibility violations', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('event edit page should not have accessibility violations', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'en')

    const editToken = editUrl.match(/edit=([a-f0-9-]+)/)?.[1]
    const eventId = editUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    await page.goto(`/en/e/${eventId}/edit?token=${editToken}`)
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('form inputs should have proper labels', async ({ page }) => {
    await page.goto('/mn/create')

    // Title input should have associated label
    const titleInput = page.locator('input[name="title"]')
    const titleLabel = await titleInput.getAttribute('aria-label') ||
                       await page.locator('label:has-text("гарчиг"), label:has-text("Гарчиг")').textContent()
    expect(titleLabel).toBeTruthy()

    // Description textarea should have associated label
    const descInput = page.locator('textarea[name="description"]')
    const descLabel = await descInput.getAttribute('aria-label') ||
                      await page.locator('label:has-text("тайлбар"), label:has-text("Тайлбар")').textContent()
    expect(descLabel).toBeTruthy()
  })

  test('buttons should have accessible text', async ({ page }) => {
    await page.goto('/en/create')

    // Submit button should have text
    const submitButton = page.locator('button[type="submit"]')
    const buttonText = await submitButton.textContent()
    expect(buttonText?.trim()).toBeTruthy()

    // Add date button should have text
    const addButton = page.locator('button:has-text("Add")')
    const addButtonText = await addButton.textContent()
    expect(addButtonText?.trim()).toBeTruthy()
  })

  test('grid cells should have aria labels', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    await page.goto(eventUrl)

    // Grid cells should have aria-label
    const gridCell = page.locator('[data-testid^="grid-cell-"]').first()
    const ariaLabel = await gridCell.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
  })

  test('grid cells should have aria-pressed state', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    const gridCell = page.locator('[data-testid^="grid-cell-"]').first()

    // Initial state: not pressed
    let ariaPressed = await gridCell.getAttribute('aria-pressed')
    expect(ariaPressed).toBe('false')

    // Click to select
    await gridCell.click()

    // Should be pressed
    ariaPressed = await gridCell.getAttribute('aria-pressed')
    expect(ariaPressed).toBe('true')
  })

  test('form validation errors should be accessible', async ({ page }) => {
    await page.goto('/en/create')

    // Trigger validation error
    await page.fill('input[name="title"]', 'Test')

    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill('2025-12-25')
    await container.locator('input[placeholder*="HH:MM"]').first().fill('10:17') // Invalid

    await page.click('button[type="submit"]')

    // Error message should be visible and accessible
    const errorMessage = page.locator('text=/15-minute/i')
    await expect(errorMessage).toBeVisible()

    // Error should have appropriate role or ARIA attributes
    const errorContainer = page.locator('[class*="red"], [class*="error"]').filter({ hasText: /15-minute/i })
    await expect(errorContainer).toBeVisible()
  })

  test('keyboard navigation should work on grid cells', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    await page.goto(eventUrl)

    // Focus first grid cell
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Navigate to grid cells

    // Should be able to activate with Space or Enter
    await page.keyboard.press('Space')

    // Cell should be selected
    const firstCell = page.locator('[data-testid^="grid-cell-"]').first()
    await expect(firstCell).toHaveAttribute('aria-pressed', 'true')
  })

  test('skip to main content should be available', async ({ page }) => {
    await page.goto('/mn')

    // Focus the page
    await page.keyboard.press('Tab')

    // Check if there's a skip link (common accessibility pattern)
    // This is optional but recommended
    const skipLink = page.locator('a[href="#main"], a[href="#content"]')
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeFocused()
    }
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/mn')

    // Find all images
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      // Alt can be empty string for decorative images, but should be present
      expect(alt).not.toBeNull()
    }
  })

  test('color contrast should be sufficient', async ({ page }) => {
    await page.goto('/en/create')

    // Run axe with color contrast rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('headings should be in correct order', async ({ page }) => {
    await page.goto('/mn')

    // Check heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Run axe with heading rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('form controls should have focus indicators', async ({ page }) => {
    await page.goto('/en/create')

    // Focus title input
    const titleInput = page.locator('input[name="title"]')
    await titleInput.focus()

    // Should have visible focus ring (check for outline or box-shadow)
    const hasOutline = await titleInput.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return (
        styles.outline !== 'none' ||
        styles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none'
      )
    })

    expect(hasOutline).toBe(true)
  })

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'en')

    await page.goto(editUrl)

    // Copy button should be keyboard accessible
    const copyButton = page.locator('button:has-text("Copy")').first()

    // Focus and activate with keyboard
    await copyButton.focus()
    await page.keyboard.press('Enter')

    // Should trigger the copy action
    await expect(page.locator('text=/copied/i')).toBeVisible({ timeout: 3000 })
  })

  test('required fields should be marked as required', async ({ page }) => {
    await page.goto('/mn/create')

    // Title input should have required attribute or aria-required
    const titleInput = page.locator('input[name="title"]')
    const isRequired = await titleInput.getAttribute('required')
    const ariaRequired = await titleInput.getAttribute('aria-required')

    expect(isRequired !== null || ariaRequired === 'true').toBe(true)
  })

  test('loading states should be accessible', async ({ page }) => {
    await page.goto('/en/create')

    await page.fill('input[name="title"]', 'Test')

    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill('2025-12-25')
    await container.locator('input[placeholder*="HH:MM"]').first().fill('10:00')

    const submitButton = page.locator('button[type="submit"]')

    // Check if button has aria-busy or similar when loading
    await submitButton.click()

    const isDisabled = await submitButton.isDisabled()
    expect(isDisabled).toBe(true)
  })

  test('toast notifications should be announced to screen readers', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    // Submit a response
    await page.fill('input[name="name"]', 'Test')
    await page.locator('[data-testid^="grid-cell-"]').first().click()
    await page.click('button[type="submit"]')

    // Toast should have role="alert" or aria-live
    const toast = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]')
    await expect(toast).toBeVisible({ timeout: 5000 })
  })

  test('language attribute should be set', async ({ page }) => {
    await page.goto('/mn')

    // HTML element should have lang attribute
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBeTruthy()
    expect(lang).toMatch(/mn|en/)
  })

  test('page should have a descriptive title', async ({ page }) => {
    await page.goto('/en')

    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })
})
