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

  await expect(page.getByRole('button', { name: '1d8 + 1d4' })).toBeVisible();
  await expect(page.getByRole('button', { name: '2d6' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'Roll 1d8 + 1d4 Probability' }).getByRole('paragraph')).toHaveText('11 Entries');

  await page.getByRole('row', { name: '3.13% cmp-roll-table-1__entry--0 Swap down Delete row' }).getByLabel('Delete row').click();
  await expect(page.getByRole('button', { name: '1d10' })).toBeVisible();
  await expect(page.getByRole('button', { name: '3d4' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'Roll 1d10 Probability' }).getByRole('paragraph')).toHaveText('10 Entries');
});

// Quick setup generating the correct table
test('quick setup', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'settings' }).click();

  await expect(page.getByRole('button', { name: '3d6' })).toBeVisible();
  await page.getByRole('button', { name: '3d6' }).click();

  await expect(page.getByRole('button', { name: '1d10 + 2d4' })).toBeVisible();
  await expect(page.getByRole('button', { name: '1d8 + 1d6 + 1d4' })).toBeVisible();
  await expect(page.getByRole('button', { name: '3d6' })).toBeVisible();
  await expect(page.getByRole('button', { name: '5d4' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'Roll 3d6 Probability' }).getByRole('paragraph')).toHaveText('16 Entries');
});

// Rolling and getting a result
test('roll', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'roll' }).click();
  await expect(page.getByText(/Result:\W\d+/)).toBeVisible();
});

// Saving and loading a table
test('save and load', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // populate table
  await page.getByRole('textbox', { name: 'table-name' }).fill('Test Name');
  await page.getByRole('textbox', { name: 'table-description' }).fill('Test Description');
  await page.getByRole('cell', { name: 'cmp-roll-table-1__entry--0' }).fill('Test Entry');

  // save table
  await page.locator('.cmp-roll-table__actions__menu').first().hover();
  await page.waitForSelector('.cmp-roll-table__actions__menu__dropdown:visible');
  await page.click('[data-testid="save-button"]');

  // checked saved content
  const saved = await page.evaluate(() => JSON.stringify(localStorage));
  expect(saved).toContain("tableName");
  expect(saved).toContain("Test Name");
  expect(saved).toContain("tableDescription");
  expect(saved).toContain("Test Description");
  expect(saved).toContain("comboObj");
  expect(saved).toContain("entries");
  expect(saved).toContain("Test Entry");
  expect(saved).toContain("savedAt");
  expect(saved).toContain("updatedAt");

  // clear table
  await page.locator('.cmp-roll-table__actions__menu').first().hover();
  await page.waitForSelector('.cmp-roll-table__actions__menu__dropdown:visible');
  await page.click('[data-testid="clear-button"]');

  // make sure table is clear
  await expect(page.getByRole('textbox', { name: 'table-name' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'table-description' })).toBeEmpty();
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--0' })).toBeEmpty();

  // open the load modal
  await page.getByRole('button', { name: 'load' }).click();

  // make sure the card has the right content
  await expect(page.getByRole('dialog').getByText('Test Name')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Test Description')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Test Entry')).toBeVisible();

  // load the table
  await page.getByRole('dialog').getByRole('button', { name: 'load' }).click();

  // check loaded content
  await expect(page.getByRole('textbox', { name: 'table-name' })).toHaveValue('Test Name');
  await expect(page.getByRole('textbox', { name: 'table-description' })).toHaveValue('Test Description');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--0' })).toHaveValue('Test Entry');
});

// Switching themes
test('changing themes', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'settings' }).click();

  await expect(page.getByRole('button', { name: 'Modern dark' })).toBeVisible();
  await page.getByRole('button', { name: 'Modern dark' }).click();
  const html = page.locator('html');
  const classList = await html.evaluate(html => [...html.classList]);
  expect(classList).toEqual(['theme--modern--dark']);
});
