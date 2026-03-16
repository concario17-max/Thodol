import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Edit3, X } from 'lucide-react';
import { useUI } from '../context/UIContext';

const Reflections = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const [note, setNote] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel } = useUI();

    const noteKey = `yoga-note-${chapterNum}-${verseNum}`;
    const isReflectionsOpen = activeRightPanel === 'reflections';
    const isDesktopReflectionsOpen = activeDesktopRightPanel === 'reflections';

    useEffect(() => {
        const savedNote = localStorage.getItem(noteKey);
        setNote(savedNote || '');
    }, [noteKey]);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem(noteKey, note);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleExportCurrent = () => {
        const element = document.createElement('a');
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Yoga_Sutras_Reflection_Chapter_${chapterNum}_Sutra_${verseNum}.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    };

    const handleExportAll = () => {
        let allNotesText = 'Yoga Sutras - All Reflections\n\n';
        const noteKeys = Object.keys(localStorage).filter((key) => key.startsWith('yoga-note-'));

        noteKeys.sort((a, b) => {
            const [, , chA, vA] = a.split('-');
            const [, , chB, vB] = b.split('-');
            if (parseInt(chA, 10) !== parseInt(chB, 10)) return parseInt(chA, 10) - parseInt(chB, 10);
            return parseInt(vA, 10) - parseInt(vB, 10);
        });

        noteKeys.forEach((key) => {
            const [, , ch, v] = key.split('-');
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
                allNotesText += `--- Chapter ${ch}, Sutra ${v} ---\n${content}\n\n`;
            }
        });

        if (allNotesText === 'Yoga Sutras - All Reflections\n\n') {
            alert('No saved reflections found to export.');
            return;
        }

        const element = document.createElement('a');
        const file = new Blob([allNotesText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'Yoga_Sutras_All_Reflections.txt';
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    };

    if (!chapterNum || !verseNum) return null;

    return (
        <>
            {isReflectionsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
                    onClick={() => setActiveRightPanel(null)}
                />
            )}

            <aside
                className={`fixed inset-y-0 right-0 z-50 flex flex-col border-l border-gold-primary/20 bg-white/40 font-inter backdrop-blur-md transition-all duration-300 dark:border-dark-border/50 dark:bg-dark-surface/40 sm:w-[400px] lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]
                ${isReflectionsOpen ? 'w-[90vw] translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : 'w-[90vw] translate-x-full lg:translate-x-0'}
                ${isDesktopReflectionsOpen ? 'lg:w-[400px] lg:opacity-100' : 'lg:w-0 lg:translate-x-10 lg:border-none lg:opacity-0 overflow-hidden px-0'}`}
            >
                <div className="absolute right-4 top-4 z-50 lg:hidden">
                    <button
                        onClick={() => setActiveRightPanel(null)}
                        className="rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative flex h-full min-h-0 flex-col p-6">
                    <div className="mb-6 flex shrink-0 items-center gap-2 border-b border-gold-border/30 pb-4">
                        <Edit3 className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">
                            통찰 기록 (Reflections)
                        </h2>
                    </div>

                    <div className="mb-4 flex flex-1 min-h-0 flex-col space-y-2">
                        <div className="text-xs font-bold tracking-wider text-[#8FA0AD]">
                            {chapterNum}.{verseNum}
                        </div>

                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="수트라를 읽으며 떠오른 통찰과 메모를 기록해 보세요."
                            className="custom-scrollbar flex-1 resize-none rounded-2xl border border-gold-primary/20 bg-white/70 p-5 font-inter text-[14px] leading-relaxed text-text-primary shadow-inner backdrop-blur-sm transition-all placeholder:text-text-secondary/40 focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/20 dark:border-dark-border/60 dark:bg-dark-bg/60 dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary/40"
                        />
                    </div>

                    <div className="relative mt-4 flex gap-3 pt-2">
                        <div className="relative flex-1">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-primary/20 bg-white/60 px-4 py-2.5 text-xs font-bold tracking-wide text-text-secondary shadow-sm backdrop-blur-sm transition-all hover:bg-gold-surface/60 dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-dark-text-secondary dark:hover:bg-dark-bg"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Export
                            </button>

                            {showExportMenu && (
                                <div className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-lg border border-gold-border/50 bg-white shadow-lg dark:border-[#333] dark:bg-[#111]">
                                    <button
                                        onClick={handleExportCurrent}
                                        className="w-full border-b border-gold-border/20 px-4 py-2.5 text-left text-xs font-medium text-text-primary transition-colors hover:bg-gold-surface dark:border-[#333] dark:text-dark-text-primary dark:hover:bg-[#222]"
                                    >
                                        Current Sutra
                                    </button>
                                    <button
                                        onClick={handleExportAll}
                                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-text-primary transition-colors hover:bg-gold-surface dark:text-dark-text-primary dark:hover:bg-[#222]"
                                    >
                                        All Sutras
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-gold-muted hover:shadow-gold-primary/20 hover:shadow-lg active:scale-95 disabled:opacity-70"
                        >
                            {isSaving ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Reflections;
