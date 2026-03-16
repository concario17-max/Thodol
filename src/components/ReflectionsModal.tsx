import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchYogaData } from '../utils/dataFetcher';

interface ReflectionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReflectionNote {
    id: string;
    chapter: string;
    verse: string;
    sanskrit: string;
    content: string;
}

const ReflectionsModal = ({ isOpen, onClose }: ReflectionsModalProps) => {
    const [notesData, setNotesData] = useState<ReflectionNote[]>([]);

    useEffect(() => {
        if (!isOpen) return;

        fetchYogaData()
            .then((data) => {
                if (!data) return;

                const noteKeys = Object.keys(localStorage).filter((key) => key.startsWith('yoga-note-'));

                noteKeys.sort((a, b) => {
                    const [, , chA, vA] = a.split('-');
                    const [, , chB, vB] = b.split('-');
                    if (parseInt(chA, 10) !== parseInt(chB, 10)) return parseInt(chA, 10) - parseInt(chB, 10);
                    return parseInt(vA, 10) - parseInt(vB, 10);
                });

                const loadedNotes: ReflectionNote[] = [];

                noteKeys.forEach((key) => {
                    const [, , ch, v] = key.split('-');
                    const content = localStorage.getItem(key);

                    if (content && content.trim()) {
                        let sanskritText = '';
                        const chapterData = data[parseInt(ch, 10)];

                        if (chapterData?.sutras) {
                            const sutraData = chapterData.sutras.find((sutra) => sutra.id.split('.')[1] === v);
                            if (sutraData?.sanskrit) {
                                const lines = sutraData.sanskrit
                                    .split('\n')
                                    .map((line) => line.trim())
                                    .filter(Boolean);

                                sanskritText = lines[1] || lines[0] || '';
                                if (!sanskritText.trim()) {
                                    sanskritText = `${sutraData.sanskrit.substring(0, 50)}...`;
                                }
                            }
                        }

                        loadedNotes.push({
                            id: key,
                            chapter: ch,
                            verse: v,
                            sanskrit: sanskritText.trim(),
                            content: content.trim(),
                        });
                    }
                });

                setNotesData(loadedNotes);
            })
            .catch((err) => console.error('Failed to load yoga data for reflections:', err));
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-serif backdrop-blur-sm transition-opacity duration-300">
            <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg border border-gold-border bg-[#FDFBF7] shadow-2xl dark:bg-dark-surface">
                <div className="flex items-center justify-between border-b border-gold-border/30 p-4 sm:p-6">
                    <h2 className="text-2xl font-medium tracking-wide text-[#A68B5C] sm:text-3xl">My Reflections</h2>
                    <button
                        onClick={onClose}
                        className="-mr-2 rounded-full p-2 text-[#A68B5C] transition-colors hover:bg-gold-surface dark:hover:bg-dark-bg"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pb-10 pt-6 scroll-smooth sm:px-8">
                    {notesData.length === 0 ? (
                        <div className="py-12 text-center italic text-[#A68B5C]/60">
                            No reflections saved yet. Read a sutra and save your thoughts.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {notesData.map((note) => (
                                <div
                                    key={note.id}
                                    className="flex flex-col rounded-md border border-[#E5E0D8] bg-white p-5 shadow-sm dark:border-[#333] dark:bg-[#1C1C1E] sm:p-6"
                                >
                                    <div className="mb-4 flex flex-wrap items-baseline gap-3 border-b border-[#E5E0D8]/40 pb-4 dark:border-[#333]/50">
                                        <span className="whitespace-nowrap rounded-sm bg-[#F5EFE6] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A68B5C] dark:bg-[#2C2C2E] dark:text-[#D4AF37] sm:text-[11px]">
                                            SUTRA {note.chapter}.{note.verse}
                                        </span>
                                        <span className="font-noto text-[15px] leading-snug tracking-wide text-[#A68B5C] drop-shadow-sm dark:text-[#EAE5D9] sm:text-base">
                                            {note.sanskrit}
                                        </span>
                                    </div>
                                    <div className="font-noto-kr text-[14px] leading-relaxed text-[#5B7282] whitespace-pre-wrap break-keep dark:text-[#A0AEC0] sm:text-[15px]">
                                        {note.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReflectionsModal;
