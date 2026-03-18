import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Reflections from './components/Reflections';
import CommentarySidebar from './components/CommentarySidebar';
import ThemeToggle from './components/ThemeToggle';
import { useUI } from './context/UIContext';
import { AppShell } from './components/ui/AppShell';

const ChapterList = lazy(() => import('./pages/ChapterList'));
const VerseView = lazy(() => import('./pages/VerseView'));

const MainLayout = () => {
    const location = useLocation();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');
    const { isSidebarOpen, activeRightPanel, activeDesktopRightPanel, closeAllDrawers } = useUI();

    const shouldRenderReflections = isVerseView && (activeRightPanel === 'reflections' || activeDesktopRightPanel === 'reflections');
    const shouldRenderCommentary = isVerseView && (activeRightPanel === 'commentary' || activeDesktopRightPanel === 'commentary');

    useEffect(() => {
        closeAllDrawers();
    }, [location.pathname, closeAllDrawers]);

    return (
        <AppShell
            header={isVerseView ? <Header title="Yoga Sutras" showSidebarToggle /> : undefined}
            sidebar={isVerseView ? <Sidebar /> : undefined}
            rightPanel={
                isVerseView ? (
                    <>
                        {shouldRenderReflections ? <Reflections /> : null}
                        {shouldRenderCommentary ? <CommentarySidebar /> : null}
                    </>
                ) : undefined
            }
            isMobilePanelOpen={isSidebarOpen || activeRightPanel !== null}
            floatingAction={
                !isVerseView ? (
                    <ThemeToggle className="border border-gold-primary/20 bg-white/80 p-3 shadow-xl shadow-black/5 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-gold-primary/40 active:scale-90 dark:border-gold-primary/10 dark:bg-[#111]/80 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.6)]" />
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
                    <Route path="/" element={<ChapterList />} />
                    <Route path="/chapter/:chapterNum/verse/:verseNum" element={<VerseView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
