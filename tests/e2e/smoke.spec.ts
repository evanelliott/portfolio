import { test, expect } from '@playwright/test'

/**
 * Senior Portfolio Smoke Test
 * Validates the "Golden Path": Navigation -> Data Fetching -> Visual Rendering.
 */
test.describe('Portfolio Core UX', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app (URL provided by Playwright config or CI)
    await page.goto('/')
  })

  test('should display the preamble and 5 project panes on load', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Portfolio Showcase')
    
    const panes = page.locator('button[role="button"]')
    await expect(panes).toHaveCount(5)
  })

  test('should load project details and Mermaid diagrams when a pane is clicked', async ({ page }) => {
    // 1. Act: Click the first project pane
    const firstPane = page.locator('button').first()
    await firstPane.click()

    // 2. Assert: Content box should no longer show the 'Selection' prompt
    const contentBox = page.locator('section.border-2')
    await expect(contentBox).not.toContainText('Select a project')

    // 3. Assert: Verify technical artifacts are rendered
    await expect(page.locator('text=GitHub Repo')).toBeVisible()
    await expect(page.locator('text=Design Record')).toBeVisible()

    // 4. Critical: Verify Mermaid.js has rendered an SVG diagram
    // We wait for the 'mermaid' class to contain an <svg> element
    const mermaidSvg = page.locator('.mermaid svg')
    await expect(mermaidSvg).toBeVisible()
  })

  test('should verify WebM video element is present and configured for performance', async ({ page }) => {
    await page.locator('button').first().click()

    const video = page.locator('video')
    await expect(video).toBeVisible()
    
    // Ensure senior-level performance attributes are preserved in production
    await expect(video).toHaveAttribute('preload', 'metadata')
    await expect(video).toHaveAttribute('playsinline', '')
  })

  test('should handle deep-linking via URL parameters', async ({ page }) => {
    // Navigate directly to project 3
    await page.goto('/project/3')
    
    // The UI should automatically reflect the 'active' state for Project 03
    const activePane = page.locator('button[aria-selected="true"]')
    await expect(activePane).toContainText('Project 03')
  })
})
