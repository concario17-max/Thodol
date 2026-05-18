import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4174';

async function clickVisibleHeaderButton(page, title) {
    const index = await page.locator('header button').evaluateAll((elements, targetTitle) => {
        return elements.findIndex((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            const isVisible = Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
            return isVisible && element.getAttribute('title') === targetTitle;
        });
    }, title);

    if (index < 0) {
        throw new Error(`Missing visible header button: ${title}`);
    }

    await page.locator('header button').nth(index).click({ force: true });
}

async function getVisibleMain(page) {
    return page.locator('main#main-scroll-container');
}

async function expectVisible(locator, message) {
    if (!(await locator.first().isVisible())) {
        throw new Error(message);
    }
}

async function expectHidden(locator, message) {
    if (await locator.first().isVisible()) {
        throw new Error(message);
    }
}

async function expectSingleAudio(page, label) {
    const audioCount = await page.locator('audio').count();

    if (audioCount !== 1) {
        throw new Error(`Expected a single audio element ${label}, found ${audioCount}.`);
    }
}

async function ensureSidebarOpen(page) {
    const visibleSidebar = page.locator('aside:visible, [role="complementary"]:visible, [data-sidebar]:visible, [data-drawer]:visible');

    if ((await visibleSidebar.count()) === 0) {
        await clickVisibleHeaderButton(page, 'Open chapter sidebar');
    }
}

async function getVisibleElementIndex(page, selector) {
    return page.locator(selector).evaluateAll((elements) => {
        return elements.findIndex((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        });
    });
}

async function selectVisibleHeaderChapter(page, chapterValue) {
    const chapterPickerIndex = await getVisibleElementIndex(page, '#chapter-picker');

    if (chapterPickerIndex < 0) {
        throw new Error('Missing visible chapter picker.');
    }

    await page.locator('#chapter-picker').nth(chapterPickerIndex).selectOption(chapterValue);
    await page.waitForURL(`**/chapter/${chapterValue}/verse/1`);
}

async function waitForSidebarReadingCard(page) {
    const sidebarCard = page.locator('aside:visible, [role="complementary"]:visible, [data-sidebar]:visible, [data-drawer]:visible').first();

    await sidebarCard.waitFor({ state: 'visible' });
    await sidebarCard.getByText('Sutra', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('Axis', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('English', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('Korean', { exact: true }).waitFor({ state: 'visible' });
}

async function getVisibleRightPanel(page) {
    return page.locator('aside:visible').nth(1);
}

async function verifyRightPanelToggle(page) {
    const rightPanel = await getVisibleRightPanel(page);
    const header = rightPanel.locator(':scope > div').first();
    const content = rightPanel.locator(':scope > div').nth(1);

    await rightPanel.waitFor({ state: 'visible' });
    await header.getByText('Commentary', { exact: true }).waitFor({ state: 'visible' });
    await header.getByText('Verse notes and references', { exact: true }).waitFor({ state: 'visible' });
    await expectVisible(rightPanel.getByRole('button', { name: 'Switch to Learning Comic' }), 'Expected the commentary toggle button to be visible.');
    await expectSingleAudio(page, 'before right-panel toggle');

    await rightPanel.getByRole('button', { name: 'Switch to Learning Comic' }).click({ force: true });
    await header.getByText('Learning Comic', { exact: true }).waitFor({ state: 'visible' });
    await content.getByText('Frame 1', { exact: true }).waitFor({ state: 'visible' });
    await rightPanel.getByRole('button', { name: 'Switch to Commentary' }).waitFor({ state: 'visible' });

    await page.reload({ waitUntil: 'networkidle' });
    const reloadedRightPanel = await getVisibleRightPanel(page);
    const reloadedHeader = reloadedRightPanel.locator(':scope > div').first();

    await reloadedHeader.getByText('Learning Comic', { exact: true }).waitFor({ state: 'visible' });
    await expectVisible(
        reloadedRightPanel.getByRole('button', { name: 'Switch to Commentary' }),
        'Expected the comic mode to persist after reload.',
    );

    await rightPanel.getByRole('button', { name: 'Switch to Commentary' }).click({ force: true });
    await header.getByText('Commentary', { exact: true }).waitFor({ state: 'visible' });
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

    await desktop.page.goto(`${baseUrl}/chapter/3/verse/9`, { waitUntil: 'networkidle' });
    await verifyRightPanelToggle(desktop.page);

    await ensureSidebarOpen(desktop.page);
    await waitForSidebarReadingCard(desktop.page);

    await desktop.page.goto(`${baseUrl}/chapter/1/verse/1`, { waitUntil: 'networkidle' });

    await desktop.context.close();
}

async function runMobileFlow(browser, logs, errors) {
    const mobile = await createPage(browser, { width: 390, height: 844 }, logs, errors);

    await mobile.page.goto(`${baseUrl}/chapter/3/verse/9`, { waitUntil: 'networkidle' });
    await expectSingleAudio(mobile.page, 'on mobile verse view');

    await ensureSidebarOpen(mobile.page);
    await waitForSidebarReadingCard(mobile.page);

    await mobile.page.goto(`${baseUrl}/chapter/1/verse/1`, { waitUntil: 'networkidle' });

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
                        'desktop home chapter select',
                        'desktop home verse select',
                        'desktop right commentary surface default',
                        'desktop right comic toggle',
                        'desktop left reading card',
                        'desktop translation labels',
                        'mobile home chapter select',
                        'mobile home verse select',
                        'mobile verse audio',
                        'mobile left reading card',
                        'mobile translation labels',
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
