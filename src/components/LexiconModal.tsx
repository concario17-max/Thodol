import { useEffect, useState, useCallback, useRef } from 'react';
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
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

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

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        queueMicrotask(() => {
            closeButtonRef.current?.focus({ preventScroll: true });
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== 'Tab') {
                return;
            }

            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );

            if (!focusableElements || focusableElements.length === 0) {
                event.preventDefault();
                closeButtonRef.current?.focus({ preventScroll: true });
                return;
            }

            const focusable = Array.from(focusableElements).filter((element) => element.offsetParent !== null);
            if (focusable.length === 0) {
                event.preventDefault();
                closeButtonRef.current?.focus({ preventScroll: true });
                return;
            }

            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];
            const activeElement = document.activeElement as HTMLElement | null;

            if (event.shiftKey) {
                if (!activeElement || activeElement === firstFocusable || !modalRef.current?.contains(activeElement)) {
                    event.preventDefault();
                    lastFocusable.focus({ preventScroll: true });
                }
                return;
            }

            if (activeElement === lastFocusable) {
                event.preventDefault();
                firstFocusable.focus({ preventScroll: true });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);

            const previous = previouslyFocusedElementRef.current;
            if (previous && previous.isConnected) {
                previous.focus({ preventScroll: true });
            }

            previouslyFocusedElementRef.current = null;
        };
    }, [isOpen, onClose]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all duration-500 animate-in fade-in" role="dialog" aria-modal="true" aria-labelledby="lexicon-title">
            <div
                ref={modalRef}
                className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gold-border/12 bg-shell-main/96 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45)] dark:border-dark-border/70 dark:bg-shell-main-dark/96 dark:shadow-[0_36px_96px_-36px_rgba(0,0,0,0.72)]"
            >
                <div className="flex items-center justify-between border-b border-gold-border/10 bg-gold-surface/35 p-6 dark:border-dark-border/70 dark:bg-dark-bg/30 sm:p-8">
                    <div>
                        <h2 id="lexicon-title" className="font-display text-3xl tracking-[0.03em] text-gold-primary sm:text-4xl">
                            Lexicon
                        </h2>
                        <p className="mt-1 text-sm uppercase tracking-[0.28em] text-gold-primary/70 dark:text-gold-light/70">Reference guide</p>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-border/12 bg-shell-main/85 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-surface/70 hover:rotate-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:border-dark-border/70 dark:bg-shell-main-dark/82 dark:hover:bg-white/6 dark:focus-visible:ring-offset-shell-main-dark"
                        aria-label="Close lexicon"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth px-6 pb-12 pt-8 sm:px-12">
                    <LexiconAlphabet alphabet={alphabet} lexiconData={lexiconData} onLetterClick={scrollToLetter} />

                    {loadError ? (
                        <div className="rounded-2xl border border-gold-border/12 bg-shell-main/72 p-6 text-center text-sm text-text-secondary shadow-sm dark:bg-shell-main-dark/72 dark:text-dark-text-secondary">
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
                                            <h3 className="font-display text-3xl italic text-gold-primary">{letter}</h3>
                                            <div className="h-px flex-1 bg-gradient-to-r from-gold-border/40 to-transparent dark:from-dark-border/60" />
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
