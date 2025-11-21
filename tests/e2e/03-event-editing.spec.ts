import { test, expect } from './fixtures'
import { createEvent, extractEditToken } from './utils/helpers'
import { getBasicEventData } from './utils/test-data'

test.describe('Event Editing', () => {
  test('should show edit button with valid edit token', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'mn')

    // Navigate to event with edit token
    await page.goto(editUrl)

    // Edit button should be visible
    await expect(page.locator('button:has-text("Edit"), button:has-text("Засах")')).toBeVisible()
  })

  test('should not show edit button without edit token', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    // Navigate to event WITHOUT edit token
    await page.goto(eventUrl)

    // Edit button should NOT be visible
    await expect(page.locator('button:has-text("Edit")')).not.toBeVisible()
  })

  test('should show share dialog on first visit with edit token', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'mn')

    // Share dialog should be visible by default
    await expect(page.locator('text=/хуваалцах|share/i').first()).toBeVisible()

    // Should show both share link and edit link
    await expect(page.locator('input[value*="/e/"]').first()).toBeVisible()
  })

  test('should copy share links to clipboard', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'en')

    await page.goto(editUrl)

    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    // Click copy button for share link
    const copyButtons = page.locator('button:has-text("Copy")')
    await copyButtons.first().click()

    // Should show copied toast/message
    await expect(page.locator('text=/copied|хуулсан/i')).toBeVisible({ timeout: 3000 })
  })

  test('should navigate to edit page from event page', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(editUrl)

    // Close share dialog first if visible
    const closeButton = page.locator('button:has-text("Close"), button:has-text("Хаах")')
    if (await closeButton.isVisible()) {
      await closeButton.click()
    }

    // Click edit button
    await page.click('button:has-text("Edit"), button:has-text("Засах")')

    // Should navigate to edit page
    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+\/edit/)
  })

  test('should edit event details successfully', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'en')

    const editToken = extractEditToken(editUrl)
    const eventId = editUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    // Navigate directly to edit page
    await page.goto(`/en/e/${eventId}/edit?token=${editToken}`)

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Update event details
    const newTitle = 'Updated Meeting Title'
    const newDescription = 'This is the updated description'
    const newLocation = 'Conference Room B'

    await page.fill('input[name="title"]', newTitle)
    await page.fill('textarea[name="description"]', newDescription)
    await page.fill('input[name="location"]', newLocation)

    // Submit changes
    await page.click('button[type="submit"]')

    // Should redirect back to event page
    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+\?edit=/, { timeout: 10000 })

    // Updated details should be visible
    await expect(page.locator('h1')).toContainText(newTitle)
    await expect(page.locator('text=' + newDescription)).toBeVisible()
  })

  test('should block edit access from different device', async ({ page, context }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'mn')

    const editToken = extractEditToken(editUrl)
    const eventId = editUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    // Create a new incognito context to simulate different device
    const newContext = await page.context().browser()?.newContext()
    if (!newContext) {
      test.skip()
      return
    }

    const newPage = await newContext.newPage()

    // Try to access edit page with valid token but different device
    await newPage.goto(`/mn/e/${eventId}/edit?token=${editToken}`)

    // Should show restricted access message
    await expect(newPage.locator('text=/restricted|хориотой/i')).toBeVisible({ timeout: 10000 })

    await newContext.close()
  })

  test('should show warning when edit access is restricted', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'en')

    // Create new context to simulate different device
    const newContext = await page.context().browser()?.newContext()
    if (!newContext) {
      test.skip()
      return
    }

    const newPage = await newContext.newPage()
    await newPage.goto(editUrl)

    // Should show warning about restricted access
    await expect(newPage.locator('text=/restricted|хориотой/i')).toBeVisible()

    await newContext.close()
  })

  test('should validate required fields in edit form', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'mn')

    const editToken = extractEditToken(editUrl)
    const eventId = editUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    await page.goto(`/mn/e/${eventId}/edit?token=${editToken}`)
    await page.waitForLoadState('networkidle')

    // Clear title
    await page.fill('input[name="title"]', '')

    // Try to submit
    await page.click('button[type="submit"]')

    // Should not redirect (validation should prevent)
    await expect(page).toHaveURL(/\/edit/)

    // HTML5 validation should prevent submission
    const titleInput = page.locator('input[name="title"]')
    const isValid = await titleInput.evaluate((input: HTMLInputElement) => input.validity.valid)
    expect(isValid).toBe(false)
  })

  test('should show loading state during edit submission', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'en')

    const editToken = extractEditToken(editUrl)
    const eventId = editUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    await page.goto(`/en/e/${eventId}/edit?token=${editToken}`)
    await page.waitForLoadState('networkidle')

    // Make a change
    await page.fill('input[name="title"]', 'New Title')

    // Submit
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Should be disabled during submission
    await expect(submitButton).toBeDisabled()
  })

  test('should cancel editing and return to event page', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'mn')

    const editToken = extractEditToken(editUrl)
    const eventId = editUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    await page.goto(`/mn/e/${eventId}/edit?token=${editToken}`)
    await page.waitForLoadState('networkidle')

    // Click cancel button
    await page.click('button:has-text("Cancel"), button:has-text("Болих")')

    // Should return to event page
    await expect(page).toHaveURL(/\/e\/[a-f0-9-]+\?edit=/)
  })

  test('should require edit token to access edit page', async ({ page }) => {
    const eventData = getBasicEventData()
    const { eventUrl } = await createEvent(page, eventData, 'en')

    const eventId = eventUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    // Try to access edit page WITHOUT token
    await page.goto(`/en/e/${eventId}/edit`)

    // Should show error or redirect
    await expect(page.locator('text=/not found|error/i')).toBeVisible({ timeout: 5000 })
  })

  test('should close share dialog', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'mn')

    await page.goto(editUrl)

    // Share dialog should be visible
    await expect(page.locator('text=/хуваалцах|share/i').first()).toBeVisible()

    // Click close button
    await page.click('button:has-text("Close"), button:has-text("Хаах")')

    // Share dialog should be hidden
    await expect(page.locator('text=/edit link|засах холбоос/i')).not.toBeVisible()
  })

  test('should preserve event data when navigating to edit page', async ({ page }) => {
    const eventData = getBasicEventData()
    const { editUrl } = await createEvent(page, eventData, 'en')

    const editToken = extractEditToken(editUrl)
    const eventId = editUrl.match(/\/e\/([a-f0-9-]+)/)?.[1]

    await page.goto(`/en/e/${eventId}/edit?token=${editToken}`)
    await page.waitForLoadState('networkidle')

    // Form should be pre-filled with existing data
    await expect(page.locator('input[name="title"]')).toHaveValue(eventData.title)
    await expect(page.locator('textarea[name="description"]')).toHaveValue(eventData.description)
  })
})
