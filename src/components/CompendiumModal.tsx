import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CompendiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CompendiumModal = ({ isOpen, onClose }: CompendiumModalProps) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

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

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/42 p-4 backdrop-blur-sm transition-opacity duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compendium-title"
        >
            <div
                ref={modalRef}
                className="app-panel-card relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem]"
            >
                <div className="flex items-center justify-between border-b border-gold-border/10 bg-gold-surface/35 p-4 sm:p-6 dark:border-dark-border/70 dark:bg-dark-bg/30">
                    <h2 id="compendium-title" className="font-display text-xl tracking-[0.04em] text-gold-primary sm:text-2xl">
                        Compendium
                    </h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close compendium"
                        className="-mr-2 app-icon-button text-gold-primary hover:shadow-[0_14px_28px_-20px_rgba(0,0,0,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-shell-main-dark"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="prose max-w-none break-keep font-sans text-[15px] leading-relaxed text-text-secondary dark:prose-invert dark:text-dark-text-secondary sm:text-base">
                        <p>
                            This compendium brings together the core reading modes in one place so you can move between the sutra text, commentary, and reference material without losing your place.
                        </p>

                        <p>
                            The layout is tuned for slow reading: clear hierarchy, calm spacing, and surfaces that stay legible in both light and dark mode. Use it as a guide when you want the shape of the passage before diving into details.
                        </p>

                        <div className="rounded-r-md border-l-4 border-gold-primary bg-gold-surface/60 p-5 dark:bg-dark-bg/55">
                            <h3 className="mb-2 font-semibold text-text-primary dark:text-gold-light">How to read it</h3>
                            <p className="m-0">
                                Start with the sutra line, compare the commentary beside it, and then pull in the supporting notes only where you need more context.
                            </p>
                        </div>

                        <h3 className="border-b border-gold-border/20 pb-2 text-lg font-semibold text-gold-primary">Reading flow</h3>
                        <ul className="list-disc space-y-3 pl-5 marker:text-gold-primary">
                            <li>
                                <strong className="text-text-primary dark:text-dark-text-primary">1. Read the line first</strong>
                                <br />
                                Let the sutra settle on its own before comparing interpretations.
                            </li>
                            <li>
                                <strong className="text-text-primary dark:text-dark-text-primary">2. Check the commentary</strong>
                                <br />
                                Use the explanatory text to see how the passage is framed in context.
                            </li>
                            <li>
                                <strong className="text-text-primary dark:text-dark-text-primary">3. Cross-reference carefully</strong>
                                <br />
                                When a phrase feels dense, compare related notes instead of forcing a single reading.
                            </li>
                            <li>
                                <strong className="text-text-primary dark:text-dark-text-primary">4. Return to the text</strong>
                                <br />
                                Revisit the sutra after the reference pass so the full structure lands cleanly.
                            </li>
                        </ul>

                        <h3 className="border-b border-gold-border/20 pb-2 text-lg font-semibold text-gold-primary">Practical tips</h3>
                        <ul className="list-disc space-y-2 pl-5 marker:text-gold-primary">
                            <li>Keep the current chapter open while you compare passages.</li>
                            <li>Use the audio and navigation controls to stay anchored in the sequence.</li>
                            <li>Watch the commentary and verse views side by side when the wording shifts.</li>
                            <li>The modal is built to stay readable without overpowering the reading surface.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompendiumModal;
