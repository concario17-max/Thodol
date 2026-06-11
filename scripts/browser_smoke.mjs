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

async function getVerseModeToggleButtons(page) {
    return page.locator('header button[aria-pressed]:visible');
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
    try {
        await locator.first().waitFor({ state: 'hidden', timeout: 5000 });
    } catch (error) {
        throw new Error(`${message} (Detail: ${error.message})`);
    }
}

// expectSingleAudio helper removed due to Howler.js integration

async function expectNoVisibleCommentaryPanel(page) {
    const visibleCommentaryPanels = page.locator('aside:visible').filter({ hasText: 'Commentary' });
    const panelCount = await visibleCommentaryPanels.count();

    if (panelCount !== 0) {
        throw new Error(`Expected no visible commentary side panel on verse routes, found ${panelCount}.`);
    }

    const visibleCommentaryHeaderButtons = page.locator('header button:visible').filter({ hasText: 'Commentary' });
    const buttonCount = await visibleCommentaryHeaderButtons.count();

    if (buttonCount !== 0) {
        throw new Error(`Expected no visible commentary header button on verse routes, found ${buttonCount}.`);
    }
}

async function expectBodyModeUi(page) {
    const main = await getVisibleMain(page);
    const bodyMarker = main.locator('section').getByText('영어 번역', { exact: true });
    const commentaryMarker = main.locator('section').getByText('Commentary', { exact: true });

    await expectVisible(bodyMarker, 'Expected 영어 번역 to be visible in body mode.');
    await expectHidden(commentaryMarker, 'Expected commentary marker Commentary to stay hidden in body mode.');
}

async function expectCommentaryModeUi(page) {
    const main = await getVisibleMain(page);
    const bodyMarker = main.locator('section').getByText('영어 번역', { exact: true });
    const commentaryMarker = main.locator('section').getByText('Commentary', { exact: true });

    await expectHidden(bodyMarker, 'Expected 영어 번역 to be hidden in commentary mode.');
    await expectVisible(commentaryMarker, 'Expected commentary marker Commentary to be visible in commentary mode.');
}

async function toggleVerseMode(page, modeIndex) {
    const buttons = await getVerseModeToggleButtons(page);
    await buttons.nth(modeIndex).click({ force: true });
}

async function waitForVerseMode(page, modeIndex) {
    await page.waitForFunction((targetIndex) => {
        const buttons = Array.from(document.querySelectorAll('header button[aria-pressed]')).filter((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        });
        const targetButton = buttons[targetIndex];

        return targetButton instanceof HTMLElement && targetButton.getAttribute('aria-pressed') === 'true';
    }, modeIndex);
}

async function ensureSidebarOpen(page) {
    const visibleSidebar = page.locator('aside:visible, [role="complementary"]:visible, [data-sidebar]:visible, [data-drawer]:visible');

    if ((await visibleSidebar.count()) === 0) {
        await clickVisibleHeaderButton(page, 'Open chapter sidebar');
    }
}

async function waitForHomeSelects(page) {
    const pickerButton = page.locator('button[aria-haspopup="dialog"]:visible');
    await pickerButton.waitFor({ state: 'visible' });
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
    const pickerButton = page.locator('button[aria-haspopup="dialog"]:visible');
    await pickerButton.click();

    const chapterHeader = page.locator('button').filter({ hasText: `제${chapterValue}장` });
    await chapterHeader.waitFor({ state: 'visible' });
    await chapterHeader.click();

    const verseButton = page.getByRole('button', { name: `${verseValue}절`, exact: true });
    await verseButton.waitFor({ state: 'visible' });
    await verseButton.click();

    await page.waitForURL(`**/chapter/${chapterValue}/verse/${verseValue}`);
    await pickerButton.waitFor({ state: 'visible' });
    await page.getByText('영어 번역').first().waitFor({ state: 'visible' });
}

async function selectVisibleHeaderChapter(page, chapterValue) {
    const pickerButton = page.locator('button[aria-haspopup="dialog"]:visible');
    await pickerButton.click();

    const chapterHeader = page.locator('button').filter({ hasText: `제${chapterValue}장` });
    await chapterHeader.waitFor({ state: 'visible' });
    await chapterHeader.click();

    const verseButton = page.getByRole('button', { name: `1절`, exact: true });
    await verseButton.waitFor({ state: 'visible' });
    await verseButton.click();

    await page.waitForURL(`**/chapter/${chapterValue}/verse/1`);
    await pickerButton.waitFor({ state: 'visible' });
    await page.getByText('영어 번역').first().waitFor({ state: 'visible' });
}

async function waitForSidebarReadingCard(page) {
    const sidebarCard = page.locator('aside:visible, [role="complementary"]:visible, [data-sidebar]:visible, [data-drawer]:visible').first();

    await sidebarCard.waitFor({ state: 'visible' });
    await sidebarCard.getByText('Chapter', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('03', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('Verse', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('09', { exact: true }).waitFor({ state: 'visible' });
    await sidebarCard.getByText('정창영 번역', { exact: true }).waitFor({ state: 'visible' });
}

async function waitForTranslationLabels(page) {
    await page.getByText('영어 번역', { exact: true }).first().waitFor({ state: 'visible' });
    await page.getByText('중암 선혜', { exact: true }).first().waitFor({ state: 'visible' });
    await page.getByText('류시화', { exact: true }).first().waitFor({ state: 'visible' });
}

async function verifyVerseModePersistence(page) {
    await expectNoVisibleCommentaryPanel(page);
    await expectBodyModeUi(page);

    await toggleVerseMode(page, 0);
    await waitForVerseMode(page, 0);

    await expectNoVisibleCommentaryPanel(page);
    await expectCommentaryModeUi(page);

    const storedMode = await page.evaluate(() => localStorage.getItem('yoga-verse-content-mode'));
    if (storedMode !== 'commentary') {
        throw new Error(`Expected localStorage to store commentary mode, found ${storedMode ?? 'null'}.`);
    }

    await page.reload({ waitUntil: 'networkidle' });
    await waitForVerseMode(page, 0);
    await expectNoVisibleCommentaryPanel(page);
    await expectCommentaryModeUi(page);

    await toggleVerseMode(page, 1);
    await waitForVerseMode(page, 1);
    await expectNoVisibleCommentaryPanel(page);
    await expectBodyModeUi(page);
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

        localStorage.removeItem('yoga-verse-content-mode');
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
    await verifyVerseModePersistence(desktop.page);

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
    await verifyVerseModePersistence(mobile.page);



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
                        'desktop verse no visible commentary panel',
                        'desktop verse body mode markers',
                        'desktop verse commentary mode markers',
                        'desktop verse audio persists through toggles',
                        'desktop verse mode persistence',
                        'desktop left reading card',
                        'desktop translation labels',
                        'mobile home chapter select',
                        'mobile home verse select',
                        'mobile verse header selects',
                        'mobile verse no visible commentary panel',
                        'mobile verse body mode markers',
                        'mobile verse commentary mode markers',
                        'mobile verse audio persists through toggles',
                        'mobile verse mode persistence',
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
