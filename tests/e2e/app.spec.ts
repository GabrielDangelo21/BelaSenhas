import { test, expect } from '@playwright/test';

test.describe('Bela-Senhas App', () => {
    test.beforeEach(async ({ page }) => {
        // Wait for the initial GET load when navigating
        await Promise.all([
            page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'GET'),
            page.goto('/')
        ]);
    });

    test('should display the correct title', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Bela-Senhas');
    });

    test('should add a new password and display it', async ({ page }) => {
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'AAA Test Service');
        await page.fill('input[placeholder="SENHA"]', 'password123');

        const responsePromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'POST');
        await page.click('button:has-text("ADICIONAR")');
        await responsePromise;

        // Add a small wait for the list to re-render and sort
        await expect(page.locator('h3:has-text("AAA Test Service")')).toBeVisible({ timeout: 10000 });
    });

    test('should sort passwords alphabetically', async ({ page }) => {
        // Add Zebra
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Zebra Service');
        await page.fill('input[placeholder="SENHA"]', 'pass1');
        let resPromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'POST');
        await page.click('button:has-text("ADICIONAR")');
        await resPromise;

        // Add Apple
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Apple Service');
        await page.fill('input[placeholder="SENHA"]', 'pass2');
        resPromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'POST');
        await page.click('button:has-text("ADICIONAR")');
        await resPromise;

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
        const resPromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'POST');
        await page.click('button:has-text("ADICIONAR")');
        await resPromise;

        await page.fill('input[placeholder="BUSCAR SERVIÇO..."]', 'Unique');
        await expect(page.locator('h3:has-text("Unique Service")')).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Visibility Test');
        await page.fill('input[placeholder="SENHA"]', 'secret-pass');
        const resPromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'POST');
        await page.click('button:has-text("ADICIONAR")');
        await resPromise;

        const card = page.locator('.card-brutalist', { hasText: 'Visibility Test' }).first();
        await card.hover();

        // Force click for buttons that might be hidden by CSS animations
        await card.locator('button[title="Ver Senha"]').click({ force: true });
        await expect(card.locator('text=secret-pass')).toBeVisible();

        await card.locator('button[title="Ocultar Senha"]').click({ force: true });
        await expect(card.locator('text=********')).toBeVisible();
    });

    test('should delete a password', async ({ page }) => {
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', 'Delete Me');
        await page.fill('input[placeholder="SENHA"]', 'pass');
        const resPromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'POST');
        await page.click('button:has-text("ADICIONAR")');
        await resPromise;

        const card = page.locator('.card-brutalist', { hasText: 'Delete Me' }).first();
        await card.hover();

        const deletePromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'DELETE');
        await card.locator('button[title="Excluir"]').click({ force: true });
        await deletePromise;

        await expect(card).not.toBeVisible();
    });

    test('should not allow duplicate service names', async ({ page }) => {
        const serviceName = 'Duplicate Test';

        // Add first time
        await page.fill('input[placeholder="NOME DO SERVIÇO"]', serviceName);
        await page.fill('input[placeholder="SENHA"]', 'pass1');
        const resPromise = page.waitForResponse(r => r.url().includes('/api/passwords') && r.request().method() === 'POST');
        await page.click('button:has-text("ADICIONAR")');
        await resPromise;

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
