import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import LexiconAlphabet from './LexiconAlphabet';
import LexiconItem from './LexiconItem';

interface LexiconModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LexiconWord {
    word: string;
    meaning: string;
}

type LexiconData = Record<string, LexiconWord[]>;

const LexiconModal = ({ isOpen, onClose }: LexiconModalProps) => {
    const [lexiconData, setLexiconData] = useState<LexiconData>({});
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && Object.keys(lexiconData).length === 0 && !loadError) {
            fetch('/lexicon.json')
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Failed to load lexicon data: ${res.status}`);
                    }

                    return res.json() as Promise<LexiconData>;
                })
                .then((data) => {
                    setLexiconData(data);
                    setLoadError(null);
                })
                .catch(() => {
                    setLoadError('Lexicon data is unavailable right now.');
                });
        }
    }, [isOpen, lexiconData, loadError]);

    const alphabet = 'ABCDEFGHIJKLMNOPRSTUVY'.split('');

    const scrollToLetter = useCallback((letter: string) => {
        const element = document.getElementById(`lexicon-${letter}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-500 animate-in fade-in">
            <div className="relative flex max-h-[90vh] w-full max-w-[52rem] flex-col overflow-hidden rounded-[1.75rem] border border-gold-border/30 bg-gold-bg shadow-[0_30px_80px_-30px_rgba(0,0,0,0.42)] dark:bg-dark-surface dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                <div className="flex items-center justify-between border-b border-gold-border/10 bg-gold-surface/30 p-6 dark:bg-dark-bg/30 sm:p-8">
                    <div>
                        <h2 className="font-crimson text-3xl tracking-tighter text-gold-primary sm:text-4xl">Lexicon</h2>
                        <p className="mt-1 font-inter text-sm uppercase tracking-widest text-gold-muted/70">Reference Guide</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="-mr-2 rounded-full p-3 text-gold-primary transition-all duration-300 hover:rotate-90 hover:bg-gold-primary/10 dark:hover:bg-white/5"
                        aria-label="Close"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth px-6 pb-12 pt-8 sm:px-12">
                    <LexiconAlphabet alphabet={alphabet} lexiconData={lexiconData} onLetterClick={scrollToLetter} />

                    {loadError ? (
                        <div className="rounded-2xl border border-gold-border/30 bg-white/70 p-6 text-center text-sm text-text-secondary shadow-sm dark:bg-dark-bg/50 dark:text-dark-text-secondary">
                            {loadError}
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {alphabet.map((letter) => {
                                const words = lexiconData[letter];
                                if (!words || words.length === 0) {
                                    return null;
                                }

                                return (
                                    <div key={letter} id={`lexicon-${letter}`} className="group scroll-mt-12">
                                        <div className="mb-8 flex items-center gap-4">
                                            <h3 className="font-crimson text-3xl italic text-gold-primary">{letter}</h3>
                                            <div className="h-px flex-1 bg-gradient-to-r from-gold-border/40 to-transparent" />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {words.map((item, index) => (
                                                <LexiconItem key={`${item.word}-${index}`} word={item.word} meaning={item.meaning} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LexiconModal;
