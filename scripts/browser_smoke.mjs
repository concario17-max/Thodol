import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4174';
const menuButtonTitle = 'Open chapter sidebar';
const commentaryOpenTitle = 'Open commentary panel';
const commentaryCloseTitle = 'Close commentary panel';

async function getVisibleHeaderButtonIndex(page, title) {
    return page.locator('header button').evaluateAll((elements, targetTitle) => {
        return elements.findIndex((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            const isVisible = Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
            return isVisible && element.getAttribute('title') === targetTitle;
        });
    }, title);
}

async function clickVisibleHeaderButton(page, title) {
    const index = await getVisibleHeaderButtonIndex(page, title);

    if (index < 0) {
        throw new Error(`Missing visible header button: ${title}`);
    }

    await page.locator('header button').nth(index).click({ force: true });
}

async function waitForCommentaryPanel(page) {
    await page.waitForTimeout(500);
    const titles = await page.locator('header button').evaluateAll((elements) => {
        return elements.flatMap((element) => {
            if (!(element instanceof HTMLElement)) {
                return [];
            }

            const isVisible = Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
            return isVisible ? [element.getAttribute('title') ?? ''] : [];
        });
    });

    if (!titles.includes(commentaryCloseTitle)) {
        throw new Error(`Commentary panel did not open. visibleTitles=${JSON.stringify(titles)}`);
    }
}

async function waitForCommentaryClosed(page) {
    await page.waitForTimeout(500);
    const titles = await page.locator('header button').evaluateAll((elements) => {
        return elements.flatMap((element) => {
            if (!(element instanceof HTMLElement)) {
                return [];
            }

            const isVisible = Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
            return isVisible ? [element.getAttribute('title') ?? ''] : [];
        });
    });

    if (!titles.includes(commentaryOpenTitle)) {
        throw new Error(`Commentary panel did not close. visibleTitles=${JSON.stringify(titles)}`);
    }
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
        if (sessionStorage.getItem('__smoke-storage-reset') === 'true') {
            return;
        }

        localStorage.removeItem('yoga-desktop-right-panel');
        localStorage.removeItem('yoga-desktop-sidebar');
        sessionStorage.setItem('__smoke-storage-reset', 'true');
    });

    return { context, page };
}

async function runDesktopFlow(browser, logs, errors) {
    const desktop = await createPage(browser, { width: 1440, height: 1000 }, logs, errors);

    await desktop.page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await desktop.page.waitForSelector('a[href="/chapter/1/verse/1"]');
    await desktop.page.click('a[href="/chapter/1/verse/1"]');
    await desktop.page.waitForURL('**/chapter/1/verse/1');
    await desktop.page.waitForSelector('header');
    await desktop.page.waitForSelector('#main-scroll-container');
    await desktop.page.waitForSelector('text=WORD-BY-WORD', { state: 'attached' });

    const openIndex = await getVisibleHeaderButtonIndex(desktop.page, commentaryOpenTitle);
    if (openIndex < 0) {
        throw new Error('Desktop commentary toggle was not rendered.');
    }

    await desktop.page.evaluate(() => {
        localStorage.setItem('yoga-desktop-right-panel', JSON.stringify('commentary'));
    });
    await desktop.page.reload({ waitUntil: 'networkidle' });
    await desktop.page.waitForSelector('header');
    await desktop.page.waitForSelector('text=WORD-BY-WORD', { state: 'attached' });
    await waitForCommentaryPanel(desktop.page);

    await clickVisibleHeaderButton(desktop.page, commentaryCloseTitle);
    await waitForCommentaryClosed(desktop.page);

    await desktop.context.close();
}

async function runMobileFlow(browser, logs, errors) {
    const mobile = await createPage(browser, { width: 390, height: 844 }, logs, errors);

    await mobile.page.goto(`${baseUrl}/chapter/1/verse/1`, { waitUntil: 'networkidle' });
    await mobile.page.waitForSelector('header');
    await mobile.page.waitForSelector('text=WORD-BY-WORD', { state: 'attached' });

    await clickVisibleHeaderButton(mobile.page, menuButtonTitle);
    await mobile.page.waitForSelector('a[href="/chapter/1/verse/1"]');
    await mobile.page.click('a[href="/chapter/1/verse/1"]');
    await mobile.page.waitForURL('**/chapter/1/verse/1');

    await clickVisibleHeaderButton(mobile.page, commentaryOpenTitle);
    await waitForCommentaryPanel(mobile.page);

    await clickVisibleHeaderButton(mobile.page, commentaryCloseTitle);
    await waitForCommentaryClosed(mobile.page);

    await clickVisibleHeaderButton(mobile.page, commentaryOpenTitle);
    await waitForCommentaryPanel(mobile.page);
    await mobile.page.locator('div.bg-black\\/50').click({ position: { x: 20, y: 20 } });
    await waitForCommentaryClosed(mobile.page);

    await mobile.context.close();
}

async function run() {
    const logs = [];
    const errors = [];
    const browser = await chromium.launch({ headless: true, channel: 'chrome' });

    try {
        await runDesktopFlow(browser, logs, errors);
        await runMobileFlow(browser, logs, errors);

        if (logs.length || errors.length) {
            throw new Error(JSON.stringify({ logs, errors }, null, 2));
        }

        console.log(
            JSON.stringify(
                {
                    ok: true,
                    checked: [
                        'desktop verse navigation',
                        'desktop commentary toggle',
                        'desktop commentary persistence',
                        'mobile sidebar open and route selection',
                        'mobile commentary drawer open and close',
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
