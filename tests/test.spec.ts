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
  await expect(page.getByRole('row', { name: 'Roll 1d8 + 1d4 Probability' }).getByRole('paragraph')).toHaveText('11entries');

  await page.getByRole('row', { name: '3.13% cmp-roll-table-1__entry--0 Swap down Delete row' }).getByLabel('Delete row').click();
  await expect(page.getByRole('button', { name: '1d10' })).toBeVisible();
  await expect(page.getByRole('button', { name: '3d4' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'Roll 1d10 Probability' }).getByRole('paragraph')).toHaveText('10entries');
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
  await expect(page.getByRole('row', { name: 'Roll 3d6 Probability' }).getByRole('paragraph')).toHaveText('16entries');
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

  // change title
  await page.getByRole('textbox', { name: 'table-name' }).fill('New Name');

  // click save again
  await page.locator('.cmp-roll-table__actions__menu').first().hover();
  await page.waitForSelector('.cmp-roll-table__actions__menu__dropdown:visible');
  await page.click('[data-testid="save-button"]');

  // check for save modal
  await expect(page.getByRole('heading', { name: 'Save' })).toBeVisible();

  // overwrite save
  await page.getByRole('button', { name: 'overwrite existing save' }).click();
  await expect(page.getByRole('heading', { name: 'Save' })).toBeHidden();
  const secondSaved = await page.evaluate(() => JSON.stringify(localStorage));
  expect(secondSaved).toContain("tableName");
  expect(secondSaved).toContain("New Name");
  expect(secondSaved).not.toContain("Test Name");

  // change description
  await page.getByRole('textbox', { name: 'table-description' }).fill('New Description');

  // click save again
  await page.locator('.cmp-roll-table__actions__menu').first().hover();
  await page.waitForSelector('.cmp-roll-table__actions__menu__dropdown:visible');
  await page.click('[data-testid="save-button"]');

    // check for save modal
  await expect(page.getByRole('heading', { name: 'Save' })).toBeVisible();

  // overwrite save
  await page.getByRole('button', { name: 'save as new table' }).click();
  await expect(page.getByRole('heading', { name: 'Save' })).toBeHidden();
  const thirdSaved = await page.evaluate(() => JSON.stringify(localStorage));
  expect(thirdSaved).toContain("tableName");
  expect(thirdSaved).toContain("New Name");
  expect(thirdSaved).not.toContain("Test Name");
  expect(thirdSaved).toContain("tableDescription");
  expect(thirdSaved).toContain("Test Description");
  expect(thirdSaved).toContain("New Description");

  // open the load modal
  await page.getByRole('button', { name: 'load' }).click();

  // make sure the cards have the right content
  await expect(page.getByRole('dialog').getByText('Test Name')).toBeHidden();
  await expect(page.getByRole('dialog').getByText('New Name').first()).toBeVisible();
  await expect(page.getByRole('dialog').getByText('New Name').last()).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Test Description')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('New Description')).toBeVisible();
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

// Ordering entries (move up/move down)
test('reordering entries', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('cell', { name: 'cmp-roll-table-1__entry--0' }).fill('Test Entry 1');
  await page.getByRole('cell', { name: 'cmp-roll-table-1__entry--1' }).fill('Test Entry 2');

  await page.addStyleTag({
    content: `
    .cmp-roll-table__button--move-up,
    .cmp-roll-table__button--move-down,
    .cmp-roll-table__button--delete {
        opacity: 1 !important;
        pointer-events: auto !important;
    }
`});

  await page.getByRole('button', { name: 'Swap up' }).first().click();
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--0' })).toHaveValue('Test Entry 2');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--1' })).toHaveValue('Test Entry 1');
});


// Switching tables
test('change tables', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('cell', { name: 'cmp-roll-table-1__entry--0' }).fill('Test Entry');

  await page.getByRole('button', { name: '3d4' }).click();

  await expect(page.getByRole('cell', { name: 'cmp-roll-table-2__entry--0' })).toHaveValue('Test Entry');
  await expect(page.getByRole('columnheader', { name: 'Roll 3d4' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Roll 1d10' })).toBeHidden();
});

// Invalid combination state — deselect enough dice to trigger the "no valid combos" message
test('invalid combo', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'settings' }).click();
  await page.locator('label').filter({ hasText: 'd4' }).click();
  await page.locator('label').filter({ hasText: /^d10$/ }).click();
  await page.getByRole('button', { name: 'close' }).click();

  await expect(page.getByRole('button', { name: 'Roll 3d10' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Roll 1d10' })).toBeHidden();
  await expect(page.getByRole('columnheader', { name: 'Probability' })).toBeHidden();
  await expect(page.getByText('There is no way to create a')).toBeVisible();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
});

// load an example table
test('load example table', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'settings' }).click();

  await page.getByRole('button', { name: '1d6 (6) Pickpocketing Loot' }).click();
  
  await expect(page.getByRole('columnheader', { name: 'Roll 1d6' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'table-name' })).toHaveValue('Pickpocket Loot');
  await expect(page.getByRole('textbox', { name: 'table-description' })).toHaveValue('What could a player discover when they successfully pickpocket an NPC?');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--0' })).toHaveValue('A key');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--1' })).toHaveValue('1d20 gold coins');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--2' })).toHaveValue('A piece of fruit');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--3' })).toHaveValue('A piece of jewelry');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--4' })).toHaveValue('A note');
  await expect(page.getByRole('cell', { name: 'cmp-roll-table-1__entry--5' })).toHaveValue('A cool rock');
});