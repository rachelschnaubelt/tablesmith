import { test, expect } from '@playwright/test';

// page loads
test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page).toHaveTitle("TableSmith | Dice Table Maker");
});


// Adding and removing entries
test('add and remove entry', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'add' }).click();

  await expect(page.getByRole('button', { name: '1d8 + 1d4'})).toBeVisible();
  await expect(page.getByRole('button', { name: '2d6'})).toBeVisible();
  await expect(page.getByRole('row', { name: 'Roll 1d8 + 1d4 Probability' }).getByRole('paragraph')).toHaveText('11 Entries');

  await page.getByRole('row', { name: '3.13% cmp-roll-table-1__entry--0 Swap down Delete row' }).getByLabel('Delete row').click();
  await expect(page.getByRole('button', { name: '1d10'})).toBeVisible();
  await expect(page.getByRole('button', { name: '3d4'})).toBeVisible();
  await expect(page.getByRole('row', { name: 'Roll 1d10 Probability' }).getByRole('paragraph')).toHaveText('10 Entries');
});

// Quick setup generating the correct table
test('quick setup', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'settings' }).click();

  await expect(page.getByRole('button', { name: '3d6'})).toBeVisible();
  await page.getByRole('button', { name: '3d6'}).click();
  
  await expect(page.getByRole('button', { name: '1d10 + 2d4'})).toBeVisible();
  await expect(page.getByRole('button', { name: '1d8 + 1d6 + 1d4'})).toBeVisible();
  await expect(page.getByRole('button', { name: '3d6'})).toBeVisible();
  await expect(page.getByRole('button', { name: '5d4'})).toBeVisible();
  await expect(page.getByRole('row', { name: 'Roll 3d6 Probability' }).getByRole('paragraph')).toHaveText('16 Entries');
});

// Rolling and getting a result
test('roll', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    await page.getByRole('button', { name: 'roll' }).click();
    await expect(page.getByText(/Result:\W\d+/)).toBeVisible();
});

// Saving and loading a table
// Switching themes
// Copying to clipboard