import { CSSProperties, Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar';
import CommentarySidebar from './components/CommentarySidebar';
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

interface ContextOption {
    value: string;
    label: string;
}

interface ContextPillPickerProps {
    chapterNum?: string;
    verseNum?: string;
    chapterOptions: ContextOption[];
    verseOptions: ContextOption[];
    onChangeChapter: (chapter: string) => void;
    onChangeVerse: (verse: string) => void;
}

const ContextPillPicker = ({
    chapterNum,
    verseNum,
    chapterOptions,
    verseOptions,
    onChangeChapter,
    onChangeVerse,
}: ContextPillPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const chapterSelectRef = useRef<HTMLSelectElement>(null);
    const verseSelectRef = useRef<HTMLSelectElement>(null);
    const [panelStyle, setPanelStyle] = useState<CSSProperties | null>(null);

    useEffect(() => {
        setIsOpen(false);
    }, [chapterNum, verseNum]);

    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current) {
            return;
        }

        const updatePosition = () => {
            const rect = triggerRef.current?.getBoundingClientRect();

            if (!rect) {
                return;
            }

            const panelWidth = Math.min(352, window.innerWidth - 16);
            const left = Math.min(Math.max(rect.left, 8), window.innerWidth - panelWidth - 8);
            const top = rect.bottom + 8;

            setPanelStyle({
                position: 'fixed',
                top: `${Math.round(top)}px`,
                left: `${Math.round(left)}px`,
                width: `${Math.round(panelWidth)}px`,
            });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;

            if (
                rootRef.current &&
                !rootRef.current.contains(target) &&
                !panelRef.current?.contains(target) &&
                !chapterSelectRef.current?.contains(target) &&
                !verseSelectRef.current?.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            chapterSelectRef.current?.focus();
        }
    }, [isOpen]);

    const activeChapterLabel = chapterNum ? `${chapterNum}장` : '장';
    const activeVerseLabel = verseNum ?? '절';

    const selectClassName =
        'h-10 w-full appearance-none rounded-[0.95rem] border border-gold-border/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.64)_100%)] px-3.5 pr-8 text-[11px] font-medium tracking-[0.08em] text-text-primary outline-none transition-all duration-300 hover:border-gold-border/20 hover:bg-white hover:shadow-[0_8px_24px_-20px_rgba(0,0,0,0.5)] focus:border-gold-primary/30 focus:bg-white focus:ring-1 focus:ring-gold-primary/15 dark:border-dark-border/60 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)] dark:text-dark-text-primary dark:hover:bg-white/8 dark:focus:border-gold-light/30 dark:focus:bg-white/10';

    const panel = isOpen ? (
        <div
            role="dialog"
            aria-label="Context picker"
            ref={panelRef}
            style={panelStyle ?? undefined}
            className="z-[60] rounded-[1.5rem] border border-gold-border/12 bg-gradient-to-b from-shell-main/98 via-shell-main/96 to-shell-commentary/88 p-3 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.55)] backdrop-blur-xl dark:border-dark-border/70 dark:from-shell-main-dark/98 dark:via-shell-main-dark/95 dark:to-shell-commentary-dark/88"
        >
            <div className="mb-3 overflow-hidden rounded-[1.1rem] border border-gold-border/10 bg-white/62 px-3 py-2.5 dark:border-dark-border/60 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    <span className="rounded-full border border-gold-primary/16 bg-gold-primary/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-gold-primary dark:border-gold-light/16 dark:bg-gold-light/10 dark:text-gold-light">
                        Chapter {chapterNum ?? '0'}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-gold-primary/20 to-transparent dark:from-gold-light/20" />
                    <span className="rounded-full border border-gold-primary/12 bg-shell-main/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-text-secondary/70 dark:border-gold-light/12 dark:bg-shell-main-dark/80 dark:text-dark-text-secondary/80">
                        Sutra {verseNum ?? '0'}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block rounded-[1rem] border border-gold-border/10 bg-white/55 p-2.5 dark:border-dark-border/60 dark:bg-white/5">
                    <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.22em] text-text-secondary/80 dark:text-dark-text-secondary/80">
                        Chapter
                    </span>
                    <select
                        ref={chapterSelectRef}
                        value={chapterNum ?? ''}
                        onChange={(event) => {
                            const nextChapter = event.target.value;
                            if (nextChapter) {
                                onChangeChapter(nextChapter);
                                setIsOpen(false);
                            }
                        }}
                        className={selectClassName}
                    >
                        {chapterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block rounded-[1rem] border border-gold-border/10 bg-white/55 p-2.5 dark:border-dark-border/60 dark:bg-white/5">
                    <span className="mb-1.5 block text-[9px] font-semibold tracking-[0.22em] text-text-secondary/80 uppercase dark:text-dark-text-secondary/80">
                        Sutra
                    </span>
                    <select
                        ref={verseSelectRef}
                        value={verseNum ?? ''}
                        onChange={(event) => {
                            const nextVerse = event.target.value;
                            if (nextVerse) {
                                onChangeVerse(nextVerse);
                                setIsOpen(false);
                            }
                        }}
                        className={selectClassName}
                    >
                        {verseOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    ) : null;

    return (
        <div ref={rootRef} className="relative shrink-0">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-border/14 bg-shell-main/78 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-gold-primary shadow-[0_12px_32px_-20px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-primary/30 hover:bg-white/88 active:translate-y-0 dark:border-dark-border/70 dark:bg-shell-main-dark/82 dark:text-gold-light dark:hover:bg-white/8"
            >
                <span className="whitespace-nowrap">{activeChapterLabel}</span>
                <span className="text-gold-primary/45 dark:text-gold-light/45">·</span>
                <span className="whitespace-nowrap">{activeVerseLabel}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen ? createPortal(panel, document.body) : null}
        </div>
    );
};

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { chapterNum, verseNum } = useParams<{ chapterNum?: string; verseNum?: string }>();
    const { chapters, allChapters } = useYogaData();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');
    const { isDesktopSidebarOpen } = useUI();

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
                    ? `${sutraNumberText}-${Number.parseInt(nextSutra.id.split('.')[1], 10) - 1}`
                    : sutraNumberText;

            return {
                value: sutraNumberText,
                label,
            };
        });
    }, [currentChapter]);

    const selectionControls =
        isVerseView && chapterOptions.length > 0 && verseOptions.length > 0 && currentChapterNumber !== null ? (
            <ContextPillPicker
                chapterNum={chapterNum}
                verseNum={verseNum}
                chapterOptions={chapterOptions}
                verseOptions={verseOptions}
                onChangeChapter={(nextChapter) => navigate(`/chapter/${nextChapter}/verse/1`)}
                onChangeVerse={(nextVerse) => navigate(`/chapter/${currentChapterNumber}/verse/${nextVerse}`)}
            />
        ) : undefined;

    return (
        <AppShell
            header={isVerseView ? <Header title="Yoga Sutras" showSidebarToggle selectionControls={selectionControls} /> : undefined}
            sidebar={isVerseView ? <Sidebar /> : undefined}
            rightPanel={isVerseView ? <CommentarySidebar /> : undefined}
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
