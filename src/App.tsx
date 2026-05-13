import { Suspense, lazy, useMemo } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import { useUI } from './context/UIContext';
import { AppShell } from './components/ui/AppShell';
import { getDesktopVerseColumns } from './components/ui/desktopVerseLayout';
import { useYogaData } from './hooks/useYogaData';

const VerseView = lazy(() => import('./pages/VerseView'));

const DefaultVerseRedirect = () => {
    const { chapters, loading } = useYogaData();

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-transparent">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
            </div>
        );
    }

    const firstChapter = chapters[0];
    const firstSutra = firstChapter?.sutras[0];
    const chapterNum = firstChapter?.chapter ?? 1;
    const verseNum = firstSutra?.id.split('.')[1] ?? '1';

    return <Navigate to={`/chapter/${chapterNum}/verse/${verseNum}`} replace />;
};

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { chapterNum, verseNum } = useParams<{ chapterNum?: string; verseNum?: string }>();
    const { chapters, allChapters } = useYogaData();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');
    const { isSidebarOpen, isDesktopSidebarOpen } = useUI();

    const desktopGridColumns = isVerseView ? getDesktopVerseColumns(isDesktopSidebarOpen, false) : undefined;
    const currentChapterNumber = isVerseView && chapterNum ? Number.parseInt(chapterNum, 10) : null;
    const currentChapter = currentChapterNumber !== null && allChapters ? allChapters[currentChapterNumber] : null;

    const chapterOptions = useMemo(
        () =>
            chapters.map((chapter) => ({
                value: String(chapter.chapter),
                label: `${chapter.chapter}. ${chapter.meta.name_korean}`,
            })),
        [chapters],
    );

    const verseOptions = useMemo(() => {
        if (!currentChapter) {
            return [];
        }

        return currentChapter.sutras.map((sutra, index) => {
            const sutraNumberText = sutra.id.split('.')[1];
            const sutraNumber = Number.parseInt(sutraNumberText, 10);
            const nextSutra = currentChapter.sutras[index + 1];
            const label =
                nextSutra && Number.parseInt(nextSutra.id.split('.')[1], 10) > sutraNumber + 1
                    ? `${currentChapter.chapter}.${sutraNumber}-${Number.parseInt(nextSutra.id.split('.')[1], 10) - 1}`
                    : `${currentChapter.chapter}.${sutraNumberText}`;

            return {
                value: sutraNumberText,
                label,
            };
        });
    }, [currentChapter]);

    const selectClassName =
        'h-10 w-full min-w-0 rounded-full border border-gold-border/20 bg-white/82 px-4 pr-9 text-[11px] font-medium tracking-[0.12em] text-text-primary shadow-[0_10px_22px_-22px_rgba(96,72,21,0.35)] backdrop-blur-sm outline-none transition-all duration-300 hover:border-gold-primary/35 hover:bg-white/92 focus:border-gold-primary/45 focus:bg-white focus:ring-2 focus:ring-gold-primary/10 dark:border-dark-border/70 dark:bg-dark-surface/78 dark:text-dark-text-primary dark:shadow-[0_10px_22px_-22px_rgba(0,0,0,0.65)] dark:hover:border-gold-primary/28 dark:hover:bg-dark-bg/84 dark:focus:border-gold-primary/35 dark:focus:bg-dark-bg/88 sm:h-11 sm:text-[12px]';

    const selectionControls =
        isVerseView && chapterOptions.length > 0 && verseOptions.length > 0 && currentChapterNumber !== null ? (
            <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-nowrap sm:items-center sm:gap-2">
                <label className="sr-only" htmlFor="chapter-picker">
                    Chapter
                </label>
                <select
                    id="chapter-picker"
                    value={chapterNum ?? ''}
                    onChange={(event) => {
                        const nextChapter = event.target.value;
                        if (nextChapter) {
                            navigate(`/chapter/${nextChapter}/verse/1`);
                        }
                    }}
                    className={`${selectClassName} sm:w-40`}
                >
                    {chapterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <label className="sr-only" htmlFor="verse-picker">
                    Sutra
                </label>
                <select
                    id="verse-picker"
                    value={verseNum ?? ''}
                    onChange={(event) => {
                        const nextVerse = event.target.value;
                        if (nextVerse) {
                            navigate(`/chapter/${currentChapterNumber}/verse/${nextVerse}`);
                        }
                    }}
                    className={`${selectClassName} sm:w-32`}
                >
                    {verseOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        ) : undefined;

    return (
        <AppShell
            header={isVerseView ? <Header title="Yoga Sutras" showSidebarToggle selectionControls={selectionControls} /> : undefined}
            sidebar={isVerseView ? <Sidebar /> : undefined}
            isMobilePanelOpen={isVerseView && isSidebarOpen}
            desktopGridColumns={desktopGridColumns}
            floatingAction={
                !isVerseView ? (
                    <ThemeToggle className="border border-gold-primary/20 bg-white/82 p-3 shadow-xl shadow-black/5 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-gold-primary/40 active:scale-90 dark:border-gold-primary/10 dark:bg-[#111]/80 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.6)]" />
                ) : undefined
            }
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="h-full"
                >
                    <Suspense
                        fallback={
                            <div className="flex h-full items-center justify-center bg-transparent">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
                            </div>
                        }
                    >
                        <Outlet />
                    </Suspense>
                </motion.div>
            </AnimatePresence>
        </AppShell>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<DefaultVerseRedirect />} />
                    <Route path="/chapter/:chapterNum/verse/:verseNum" element={<VerseView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
