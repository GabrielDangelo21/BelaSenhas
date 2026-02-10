import { test, expect } from '@playwright/test';

test.describe('Bela-Senhas App', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Clear localStorage before each test for isolation
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('should display the correct title', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Bela-Senhas');
    });

    test('should add a new password and display it', async ({ page }) => {
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'AAA Test Service');
        await page.fill('input[placeholder="SENHA"]', 'password123');
        await page.click('button:has-text("ADICIONAR")');

        await expect(page.locator('h3:has-text("AAA Test Service")')).toBeVisible({ timeout: 5000 });
    });

    test('should sort passwords alphabetically', async ({ page }) => {
        // Add Zebra
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Zebra Service');
        await page.fill('input[placeholder="SENHA"]', 'pass1');
        await page.click('button:has-text("ADICIONAR")');

        // Add Apple
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Apple Service');
        await page.fill('input[placeholder="SENHA"]', 'pass2');
        await page.click('button:has-text("ADICIONAR")');

        // Wait for sorting to be stable
        const h3Selectors = page.locator('h3');
        await expect(h3Selectors.first()).toBeVisible();

        const names = await h3Selectors.allTextContents();
        const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sortedNames);
    });

    test('should search for a service', async ({ page }) => {
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Unique Service');
        await page.fill('input[placeholder="SENHA"]', 'pass1');
        await page.click('button:has-text("ADICIONAR")');

        await page.fill('input[placeholder="BUSCAR SERVIÇO..."]', 'Unique');
        await expect(page.locator('h3:has-text("Unique Service")')).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Visibility Test');
        await page.fill('input[placeholder="SENHA"]', 'secret-pass');
        await page.click('button:has-text("ADICIONAR")');

        const card = page.locator('.card-brutalist', { hasText: 'Visibility Test' }).first();
        await card.hover();

        await card.locator('button[title="Ver Senha"]').click({ force: true });
        await expect(card.locator('text=secret-pass')).toBeVisible();

        await card.locator('button[title="Ocultar Senha"]').click({ force: true });
        await expect(card.locator('text=********')).toBeVisible();
    });

    test('should delete a password', async ({ page }) => {
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Delete Me');
        await page.fill('input[placeholder="SENHA"]', 'pass');
        await page.click('button:has-text("ADICIONAR")');

        const card = page.locator('.card-brutalist', { hasText: 'Delete Me' }).first();
        await card.hover();

        await card.locator('button[title="Excluir"]').click({ force: true });
        await expect(card).not.toBeVisible();
    });

    test('should not allow duplicate service names', async ({ page }) => {
        const serviceName = 'Duplicate Test';

        // Add first time
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', serviceName);
        await page.fill('input[placeholder="SENHA"]', 'pass1');
        await page.click('button:has-text("ADICIONAR")');

        // Attempt to add again with same name but different casing
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', serviceName.toLowerCase());
        await page.fill('input[placeholder="SENHA"]', 'pass2');

        // Catch alert
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Este serviço já existe');
            await dialog.dismiss();
        });

        await page.click('button:has-text("ADICIONAR")');
    });
});
