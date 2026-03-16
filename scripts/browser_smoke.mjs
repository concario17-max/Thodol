import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4174';
const menuTitle = '챕터 목록 열기';
const panelTitle = '오른쪽 패널 토글';

async function clickVisibleHeaderButton(page, title) {
    const index = await page.locator('header button').evaluateAll((elements, target) => {
        return elements.findIndex((element) => {
            const visible = !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
            return visible && element.getAttribute('title') === target;
        });
    }, title);

    if (index === -1) {
        throw new Error(`Missing visible header button: ${title}`);
    }

    await page.locator('header button').nth(index).click();
}

async function createPage(browser, viewport, logs, errors) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            logs.push(`${viewport.width}px console: ${msg.text()}`);
        }
    });

    page.on('pageerror', (err) => {
        errors.push(`${viewport.width}px pageerror: ${err.message}`);
    });

    await page.addInitScript(() => {
        localStorage.setItem('yoga_authenticated', 'true');
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
        await desktop.page.click('button:has-text("Reflections")');
        await desktop.page.waitForSelector('textarea');
        await desktop.page.click('button:has-text("Commentary")');
        await desktop.page.waitForSelector('text=Commentary');
        await desktop.page.reload({ waitUntil: 'networkidle' });
        await desktop.page.waitForSelector('text=Commentary');
        await desktop.context.close();

        const mobile = await createPage(browser, { width: 390, height: 844 }, logs, errors);
        await mobile.page.goto(`${baseUrl}/chapter/1/verse/1`, { waitUntil: 'networkidle' });
        await clickVisibleHeaderButton(mobile.page, menuTitle);
        await mobile.page.waitForSelector('a[href="/chapter/1/verse/1"]');
        await mobile.page.click('a[href="/chapter/1/verse/1"]');
        await mobile.page.waitForURL('**/chapter/1/verse/1');
        await clickVisibleHeaderButton(mobile.page, panelTitle);
        await mobile.page.waitForSelector('textarea');
        await clickVisibleHeaderButton(mobile.page, panelTitle);
        await mobile.page.waitForTimeout(400);

        const box = await mobile.page.locator('textarea').boundingBox();
        if (!box || box.x < 390) {
            throw new Error(`Mobile panel did not move off-screen. boundingBox=${JSON.stringify(box)}`);
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
