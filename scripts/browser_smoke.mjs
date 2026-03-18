import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4174';
const menuTitle = 'Open chapter sidebar';
async function clickVisibleHeaderButton(page, title) {
    const index = await page.locator('header button').evaluateAll((elements, targetTitle) => {
        return elements.findIndex((element) => {
            const visible = Boolean(element instanceof HTMLElement && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
            return visible && element.getAttribute('title') === targetTitle;
        });
    }, title);

    if (index === -1) {
        throw new Error(`Missing visible header button: ${title}`);
    }

    await page.locator('header button').nth(index).click();
}

async function clickVisiblePanelButton(page) {
    await page.waitForFunction(() => document.querySelectorAll('header button').length >= 2);
    const buttonCount = await page.locator('header button').count();
    if (buttonCount < 2) {
        throw new Error('Missing visible panel toggle button');
    }

    await page.locator('header button').nth(1).click();
}

async function createPage(browser, viewport, logs, errors) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    page.on('console', (message) => {
        if (message.type() === 'error') {
            logs.push(`${viewport.width}px console: ${message.text()}`);
        }
    });

    page.on('pageerror', (error) => {
        errors.push(`${viewport.width}px pageerror: ${error.message}`);
    });

    await page.addInitScript(() => {
        localStorage.removeItem('yoga-desktop-right-panel');
        localStorage.removeItem('yoga-desktop-sidebar');
    });

    return { context, page };
}

async function run() {
    const logs = [];
    const errors = [];
    const browser = await chromium.launch({ headless: true, channel: 'chrome' });

    try {
        const desktop = await createPage(browser, { width: 1440, height: 1000 }, logs, errors);
        await desktop.page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
        await desktop.page.click('a[href="/chapter/1/verse/1"]');
        await desktop.page.waitForURL('**/chapter/1/verse/1');
        await desktop.page.waitForSelector('header');
        await clickVisiblePanelButton(desktop.page);
        await desktop.page.waitForSelector('textarea');
        await clickVisiblePanelButton(desktop.page);
        await desktop.page.waitForTimeout(300);
        await desktop.page.reload({ waitUntil: 'networkidle' });
        await desktop.page.waitForSelector('header');
        await desktop.context.close();

        const mobile = await createPage(browser, { width: 390, height: 844 }, logs, errors);
        await mobile.page.goto(`${baseUrl}/chapter/1/verse/1`, { waitUntil: 'networkidle' });
        await mobile.page.waitForSelector('header');
        await clickVisibleHeaderButton(mobile.page, menuTitle);
        await mobile.page.waitForSelector('a[href="/chapter/1/verse/1"]');
        await mobile.page.click('a[href="/chapter/1/verse/1"]');
        await mobile.page.waitForURL('**/chapter/1/verse/1');
        await clickVisiblePanelButton(mobile.page);
        await mobile.page.waitForSelector('textarea');
        await clickVisiblePanelButton(mobile.page);
        await mobile.page.waitForTimeout(300);
        await clickVisiblePanelButton(mobile.page);
        await mobile.page.waitForSelector('textarea');
        await mobile.page.click('div[class*="bg-black/50"]', { position: { x: 20, y: 20 } });
        await mobile.page.waitForTimeout(300);

        const remainingTextareaCount = await mobile.page.locator('textarea').count();
        if (remainingTextareaCount !== 0) {
            throw new Error(`Mobile reflections panel did not close cleanly. remainingTextareaCount=${remainingTextareaCount}`);
        }

        await mobile.context.close();

        if (logs.length || errors.length) {
            throw new Error(JSON.stringify({ logs, errors }, null, 2));
        }

        console.log(
            JSON.stringify(
                {
                    ok: true,
                    checked: [
                        'desktop navigation',
                        'desktop reflections',
                        'desktop commentary restore',
                        'mobile sidebar',
                        'mobile right panel',
                    ],
                    baseUrl,
                },
                null,
                2,
            ),
        );
    } finally {
        await browser.close();
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
