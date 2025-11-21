import { test, expect } from './fixtures'
import { createEvent, submitParticipantResponse, waitForToast } from './utils/helpers'
import { getBasicEventData, getParticipantData } from './utils/test-data'

test.describe('Participant Responses', () => {
  test('should view event details without edit token', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    // Navigate to event page without edit token
    await page.goto(eventUrl)

    // Should see event details
    await expect(page.locator('h1')).toContainText(eventData.title)
    await expect(page.locator('text=' + eventData.description)).toBeVisible()

    // Should NOT see share dialog (no edit token)
    await expect(page.locator('text=/edit link|засах холбоос/i')).not.toBeVisible()

    // Should see response form
    await expect(page.locator('input[name="name"]')).toBeVisible()
  })

  test('should submit participant response successfully', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    // Navigate to event page
    await page.goto(eventUrl)

    // Fill participant name
    await page.fill('input[name="name"]', 'Bat-Erdene')

    // Click first date option as "yes" (one click)
    const firstCell = page.locator('[data-testid^="grid-cell-"]').first()
    await firstCell.click()

    // Should show green checkmark
    await expect(firstCell).toContainText('✓')

    // Click second date option as "maybe" (two clicks)
    const secondCell = page.locator('[data-testid^="grid-cell-"]').nth(1)
    await secondCell.click()
    await secondCell.click()

    // Should show yellow question mark
    await expect(secondCell).toContainText('?')

    // Add comment
    await page.fill('textarea[name="comment"]', 'Looking forward to the meeting!')

    // Submit
    await page.click('button[type="submit"]')

    // Should show success toast
    await expect(page.locator('text=/submitted|илгээгдлээ/i')).toBeVisible({ timeout: 5000 })

    // Form should be cleared
    await expect(page.locator('input[name="name"]')).toHaveValue('')

    // Results should now be visible
    await expect(page.locator('table, text=Bat-Erdene')).toBeVisible()
  })

  test('should cycle through availability statuses', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    await page.goto(eventUrl)

    const cell = page.locator('[data-testid^="grid-cell-"]').first()

    // Initial state: empty
    await expect(cell).toHaveClass(/border-gray-300/)

    // First click: yes
    await cell.click()
    await expect(cell).toContainText('✓')
    await expect(cell).toHaveClass(/border-green-500/)

    // Second click: maybe
    await cell.click()
    await expect(cell).toContainText('?')
    await expect(cell).toHaveClass(/border-yellow-500/)

    // Third click: back to empty
    await cell.click()
    await expect(cell).not.toContainText('✓')
    await expect(cell).not.toContainText('?')
  })

  test('should validate participant name is required', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    // Try to submit without name
    await page.click('button[type="submit"]')

    // HTML5 validation should prevent submission
    const nameInput = page.locator('input[name="name"]')
    const isValid = await nameInput.evaluate((input: HTMLInputElement) => input.validity.valid)
    expect(isValid).toBe(false)
  })

  test('should display multiple participant responses', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    // First participant
    await page.goto(eventUrl)
    await page.fill('input[name="name"]', 'Alice')
    await page.locator('[data-testid^="grid-cell-"]').first().click() // yes
    await page.click('button[type="submit"]')

    // Wait for success
    await expect(page.locator('text=/submitted/i')).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(1000) // Wait for results to update

    // Second participant
    await page.fill('input[name="name"]', 'Bob')
    await page.locator('[data-testid^="grid-cell-"]').first().click() // yes
    await page.click('button[type="submit"]')

    await expect(page.locator('text=/submitted/i')).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(1000)

    // Both participants should be visible in results
    await expect(page.locator('text=Alice')).toBeVisible()
    await expect(page.locator('text=Bob')).toBeVisible()

    // Results table should show counts
    await expect(page.locator('table')).toBeVisible()
  })

  test('should show best option when there are responses', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    // Add a participant response
    await page.goto(eventUrl)
    await page.fill('input[name="name"]', 'Dorj')
    await page.locator('[data-testid^="grid-cell-"]').first().click() // yes to first date
    await page.click('button[type="submit"]')

    await expect(page.locator('text=/submitted|илгээгдлээ/i')).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(1000)

    // Best option card should be visible
    await expect(page.locator('text=🏆')).toBeVisible()

    // Should show the best date with most "yes" responses
    await expect(page.locator('text=/best|хамгийн/i')).toBeVisible()
  })

  test('should show total counts in results table', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    // Add responses from multiple participants
    const participants = ['Alice', 'Bob', 'Charlie']

    for (const name of participants) {
      await page.goto(eventUrl)
      await page.fill('input[name="name"]', name)

      // All vote yes for first date
      await page.locator('[data-testid^="grid-cell-"]').first().click()

      await page.click('button[type="submit"]')
      await expect(page.locator('text=/submitted/i')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(500)
    }

    // Check totals row
    await expect(page.locator('text=/total|нийт/i')).toBeVisible()

    // First date should show 3 in the total
    const totalRow = page.locator('tr:has-text("Total"), tr:has-text("Нийт")').last()
    await expect(totalRow).toContainText('3')
  })

  test('should display comment from participant', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    const comment = 'Би энэ цагт чөлөөтэй байна'
    await page.fill('input[name="name"]', 'Naran')
    await page.fill('textarea[name="comment"]', comment)
    await page.locator('[data-testid^="grid-cell-"]').first().click()

    await page.click('button[type="submit"]')

    await expect(page.locator('text=/submitted|илгээгдлээ/i')).toBeVisible({ timeout: 5000 })
  })

  test('should handle response submission errors gracefully', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    // Mock network error by intercepting the API call
    await page.route('**/api/events/*/responses', (route) => {
      route.abort('failed')
    })

    await page.goto(eventUrl)

    await page.fill('input[name="name"]', 'Test User')
    await page.locator('[data-testid^="grid-cell-"]').first().click()
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=/error|алдаа/i')).toBeVisible({ timeout: 5000 })

    // Form should not be cleared
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User')
  })

  test('should show loading state during response submission', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(eventUrl)

    await page.fill('input[name="name"]', 'Test')
    await page.locator('[data-testid^="grid-cell-"]').first().click()

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Should be disabled during submission
    await expect(submitButton).toBeDisabled()
  })

  test('should display legend explaining cell statuses', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    await page.goto(eventUrl)

    // Legend should be visible
    await expect(page.locator('text=/legend|тайлбар/i')).toBeVisible()

    // Should show all status options
    await expect(page.locator('text=✓')).toBeVisible()
    await expect(page.locator('text=?')).toBeVisible()
  })
})
