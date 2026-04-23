import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4174';

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

async function ensureSidebarOpen(page) {
    const visibleSidebar = page.locator('aside:visible, [role="complementary"]:visible, [data-sidebar]:visible, [data-drawer]:visible');

    if ((await visibleSidebar.count()) === 0) {
        await clickVisibleHeaderButton(page, 'Open chapter sidebar');
    }
}

async function waitForHomeSelects(page) {
    const comboboxes = page.getByRole('combobox');
    await comboboxes.nth(0).waitFor({ state: 'visible' });
    await comboboxes.nth(1).waitFor({ state: 'visible' });
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

async function goFromHomeToVerse(page, chapterValue, verseValue) {
    const comboboxes = page.getByRole('combobox');
    const chapterSelect = comboboxes.nth(0);
    const verseSelect = comboboxes.nth(1);

    await chapterSelect.selectOption(chapterValue);
    await page.waitForFunction((targetVerse) => {
        const verseSelectElement = document.querySelectorAll('select')[1];

        return Boolean(
            verseSelectElement &&
                !verseSelectElement.hasAttribute('disabled') &&
                verseSelectElement.querySelector(`option[value="${targetVerse}"]`),
        );
    }, verseValue);
    await verseSelect.selectOption(verseValue);
    await page.waitForURL(`**/chapter/${chapterValue}/verse/${verseValue}`);
    await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('#chapter-picker')).some((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        }),
    );
    await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('#verse-picker')).some((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        }),
    );
}

async function selectVisibleHeaderChapter(page, chapterValue) {
    const chapterPickerIndex = await getVisibleElementIndex(page, '#chapter-picker');

    if (chapterPickerIndex < 0) {
        throw new Error('Missing visible chapter picker.');
    }

    await page.locator('#chapter-picker').nth(chapterPickerIndex).selectOption(chapterValue);
    await page.waitForURL(`**/chapter/${chapterValue}/verse/1`);
    await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('#chapter-picker')).some((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        }),
    );
    await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('#verse-picker')).some((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        }),
    );
}

async function waitForSidebarReadingCard(page) {
    const sidebarCard = page.locator('aside:visible, [role="complementary"]:visible, [data-sidebar]:visible, [data-drawer]:visible').first();

    await sidebarCard.waitFor({ state: 'visible' });
    await sidebarCard.getByText('Chapter 3', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('Sutra 9', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('Sanskrit', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('English', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('Korean', { exact: true }).waitFor({ state: 'visible' });
}

async function waitForTranslationLabels(page) {
    await page.locator('section h2').nth(0).waitFor({ state: 'visible' });
    await page.locator('section h2').nth(1).waitFor({ state: 'visible' });
    await page.locator('section h3').nth(0).waitFor({ state: 'visible' });
    await page.locator('section h3').nth(1).waitFor({ state: 'visible' });
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
    await waitForHomeSelects(desktop.page);
    await goFromHomeToVerse(desktop.page, '3', '9');
    await waitForHomeSelects(desktop.page);

    await ensureSidebarOpen(desktop.page);
    await waitForSidebarReadingCard(desktop.page);

    await selectVisibleHeaderChapter(desktop.page, '1');
    await waitForTranslationLabels(desktop.page);

    await desktop.context.close();
}

async function runMobileFlow(browser, logs, errors) {
    const mobile = await createPage(browser, { width: 390, height: 844 }, logs, errors);

    await mobile.page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await waitForHomeSelects(mobile.page);
    await goFromHomeToVerse(mobile.page, '3', '9');
    await waitForHomeSelects(mobile.page);

    await ensureSidebarOpen(mobile.page);
    await waitForSidebarReadingCard(mobile.page);

    await selectVisibleHeaderChapter(mobile.page, '1');
    await waitForTranslationLabels(mobile.page);

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
                        'desktop verse header selects',
                        'desktop left reading card',
                        'desktop translation labels',
                        'mobile home chapter select',
                        'mobile home verse select',
                        'mobile verse header selects',
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
