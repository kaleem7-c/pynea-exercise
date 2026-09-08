import { test, expect } from '@playwright/test';

test('browse, search, and view a Pokemon', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Pokemon Explorer' })).toBeVisible();

  const firstCardLink = page.locator('a.card').first();
  await expect(firstCardLink).toBeVisible();

  await page.getByLabel('Search Pokemon').fill('pikachu');
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page).toHaveURL(/[?&]q=pikachu/);
  await page.locator('a.card', { hasText: 'pikachu' }).first().click();

  await expect(page).toHaveURL(/\/pokemon\/pikachu$/);
  await expect(page.getByRole('heading', { name: /pikachu/i })).toBeVisible();
  await expect(page.getByText('electric', { exact: false })).toBeVisible();

  await page.getByRole('link', { name: /back to list/i }).click();
  await expect(page).toHaveURL('/');
});

test('shows a not-found state for an unknown Pokemon', async ({ page }) => {
  await page.goto('/pokemon/not-a-real-pokemon');
  await expect(page.getByText('Pokemon not found.')).toBeVisible();
});
