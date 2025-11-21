import { test, expect } from './fixtures'
import { goToCreatePage, fillEventForm, submitEventForm, extractEventId } from './utils/helpers'
import { getBasicEventData, getMultiDateEventData, getInvalidEventData } from './utils/test-data'

test.describe('Event Creation', () => {
  test('should navigate to create page from home', async ({ page }) => {
    await page.goto('/mn')

    // Click the create button on home page
    await page.click('a[href="/create"]')

    await expect(page).toHaveURL(/\/create/)
  })

  test('should create a basic event successfully', async ({ page }) => {
    const eventData = getBasicEventData()

    await goToCreatePage(page, 'mn')

    // Fill the form
    await page.fill('input[name="title"]', eventData.title)
    await page.fill('textarea[name="description"]', eventData.description)

    // Fill date options
    for (let i = 0; i < eventData.dates.length; i++) {
      const dateOption = eventData.dates[i]
      const container = page.locator(`[data-testid="date-time-input-${i}"]`)

      await container.locator('input[type="text"]').first().fill(dateOption.date)
      await container.locator('input[placeholder*="HH:MM"]').first().fill(dateOption.startTime)
      await container.locator('input[placeholder*="HH:MM"]').last().fill(dateOption.endTime)
    }

    // Submit the form
    await submitEventForm(page)

    // Should redirect to event page
    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+\?edit=/, { timeout: 10000 })

    // Verify event details are shown
    await expect(page.locator('h1')).toContainText(eventData.title)
    await expect(page.locator('text=' + eventData.description)).toBeVisible()

    // Should show the share dialog with edit token
    await expect(page.locator('text=/share|хуваалцах/i')).toBeVisible()
  })

  test('should create event with multiple dates', async ({ page }) => {
    const eventData = getMultiDateEventData()

    await goToCreatePage(page, 'en')

    // Fill basic info
    await page.fill('input[name="title"]', eventData.title)
    await page.fill('textarea[name="description"]', eventData.description)

    // Add more date options (default is 2, we need 5)
    for (let i = 0; i < 3; i++) {
      await page.click('button:has-text("Add")')
    }

    // Wait for new inputs to be added
    await page.waitForTimeout(300)

    // Fill all date options
    for (let i = 0; i < eventData.dates.length; i++) {
      const dateOption = eventData.dates[i]
      const container = page.locator(`[data-testid="date-time-input-${i}"]`)

      await container.locator('input[type="text"]').first().fill(dateOption.date)
      await container.locator('input[placeholder*="HH:MM"]').first().fill(dateOption.startTime)
      await container.locator('input[placeholder*="HH:MM"]').last().fill(dateOption.endTime)
    }

    // Submit
    await submitEventForm(page)

    // Should redirect successfully
    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+/, { timeout: 10000 })
  })

  test('should remove date options', async ({ page }) => {
    await goToCreatePage(page, 'mn')

    // Add a third date option
    await page.click('button:has-text("Add"), button:has-text("Нэмэх")')

    // Wait for it to appear
    await expect(page.locator('[data-testid="date-time-input-2"]')).toBeVisible()

    // Hover over the third date input to show remove button
    await page.locator('[data-testid="date-time-input-2"]').hover()

    // Click remove button (X button)
    await page.locator('[data-testid="date-time-input-2"] button[aria-label*="Remove"], [data-testid="date-time-input-2"] button[aria-label*="Устгах"]').click()

    // Third input should be removed
    await expect(page.locator('[data-testid="date-time-input-2"]')).not.toBeVisible()
  })

  test('should validate required title', async ({ page }) => {
    await goToCreatePage(page, 'mn')

    // Try to submit without filling title
    await submitEventForm(page)

    // Should not redirect (form validation should prevent submission)
    await expect(page).toHaveURL(/\/create/)

    // HTML5 validation should prevent submission
    const titleInput = page.locator('input[name="title"]')
    const isValid = await titleInput.evaluate((input: HTMLInputElement) => input.validity.valid)
    expect(isValid).toBe(false)
  })

  test('should validate 15-minute time increments', async ({ page }) => {
    const invalidData = getInvalidEventData()

    await goToCreatePage(page, 'en')

    await page.fill('input[name="title"]', invalidData.invalidTime.title)
    await page.fill('textarea[name="description"]', invalidData.invalidTime.description)

    // Fill with invalid time (not 15-minute increment)
    const container = page.locator('[data-testid="date-time-input-0"]')
    await container.locator('input[type="text"]').first().fill(invalidData.invalidTime.dates[0].date)
    await container.locator('input[placeholder*="HH:MM"]').first().fill(invalidData.invalidTime.dates[0].startTime)

    // Submit
    await submitEventForm(page)

    // Should show error message
    await expect(page.locator('text=/15-minute increments|15 минут/i')).toBeVisible()

    // Should not redirect
    await expect(page).toHaveURL(/\/create/)
  })

  test('should validate duplicate date/time combinations', async ({ page }) => {
    const invalidData = getInvalidEventData()

    await goToCreatePage(page, 'en')

    await page.fill('input[name="title"]', invalidData.duplicateDates.title)

    // Fill same date/time for both options
    for (let i = 0; i < 2; i++) {
      const container = page.locator(`[data-testid="date-time-input-${i}"]`)
      await container.locator('input[type="text"]').first().fill(invalidData.duplicateDates.dates[i].date)
      await container.locator('input[placeholder*="HH:MM"]').first().fill(invalidData.duplicateDates.dates[i].startTime)
      await container.locator('input[placeholder*="HH:MM"]').last().fill(invalidData.duplicateDates.dates[i].endTime)
    }

    // Submit
    await submitEventForm(page)

    // Should show error message about duplicates
    await expect(page.locator('text=/duplicate|давхцаж/i')).toBeVisible()

    // Should not redirect
    await expect(page).toHaveURL(/\/create/)
  })

  test('should auto-fill end time on focus', async ({ page }) => {
    await goToCreatePage(page, 'mn')

    const container = page.locator('[data-testid="date-time-input-0"]')

    // Fill start time
    await container.locator('input[placeholder*="HH:MM"]').first().fill('14:00')

    // Focus on end time input
    await container.locator('input[placeholder*="HH:MM"]').last().focus()

    // End time should be auto-filled with start time + 2 hours
    await expect(container.locator('input[placeholder*="HH:MM"]').last()).toHaveValue('16:00')
  })

  test('should accept date in slash format and convert to dash', async ({ page }) => {
    await goToCreatePage(page, 'mn')

    const container = page.locator('[data-testid="date-time-input-0"]')

    // Fill date with slashes
    await container.locator('input[type="text"]').first().fill('2025/12/25')

    // Blur the input to trigger normalization
    await container.locator('input[type="text"]').first().blur()

    // Should be converted to dash format
    await expect(container.locator('input[type="text"]').first()).toHaveValue('2025-12-25')
  })

  test('should show voice recording option', async ({ page }) => {
    await goToCreatePage(page, 'mn')

    // Voice recorder section should be visible
    await expect(page.locator('text=/дуугаар оруулах|voice input/i')).toBeVisible()
  })

  test('should show loading state during submission', async ({ page }) => {
    const eventData = getBasicEventData()

    await goToCreatePage(page, 'mn')

    // Fill the form
    await page.fill('input[name="title"]', eventData.title)

    for (let i = 0; i < 2; i++) {
      const container = page.locator(`[data-testid="date-time-input-${i}"]`)
      await container.locator('input[type="text"]').first().fill(eventData.dates[i].date)
      await container.locator('input[placeholder*="HH:MM"]').first().fill(eventData.dates[i].startTime)
    }

    // Click submit
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Button should show loading state
    await expect(submitButton).toBeDisabled()
  })
})
