import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { WordMeaning } from '../../types';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';

interface WordMeaningsProps {
    meanings?: WordMeaning;
}

const formatMeaning = (meaning: string) => {
    const etymologySeparator = ' < ';
    const separatorIndex = meaning.indexOf(etymologySeparator);

    if (separatorIndex === -1) {
        return meaning;
    }

    return meaning.slice(0, separatorIndex).trim();
};

const createContainerVariants = (reduceMotion: boolean): Variants => ({
    hidden: {
        opacity: reduceMotion ? 1 : 0,
        height: reduceMotion ? 'auto' : 0,
    },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: reduceMotion
            ? { duration: 0 }
            : {
                  height: { duration: 0.45, ease: [0.2, 0, 0, 1] },
                  opacity: { duration: 0.25 },
                  staggerChildren: 0.04,
                  delayChildren: 0.08,
              },
    },
    exit: {
        opacity: reduceMotion ? 1 : 0,
        height: reduceMotion ? 'auto' : 0,
        transition: reduceMotion
            ? { duration: 0 }
            : {
                  height: { duration: 0.35, ease: [0.2, 0, 0, 1] },
                  opacity: { duration: 0.2 },
              },
    },
});

const createItemVariants = (reduceMotion: boolean): Variants => ({
    hidden: {
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' },
    },
});

export const WordMeanings = ({ meanings }: WordMeaningsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const reduceMotion = useReducedMotion();
    const panelId = useId();

    if (!meanings || meanings.length === 0) return null;

    const containerVariants = createContainerVariants(Boolean(reduceMotion));
    const itemVariants = createItemVariants(Boolean(reduceMotion));

    return (
        <section className="mx-auto w-full max-w-[58rem] px-4 sm:px-6 lg:px-8">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-3 border-t border-gold-border/10 pt-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:border-dark-border/45 dark:focus-visible:ring-offset-shell-main-dark"
            >
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">
                        Word meanings
                    </p>
                </div>

                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.2, 0, 0, 1] }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-border/12 bg-shell-main/75 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:border-dark-border/70 dark:bg-shell-main-dark/75 dark:text-gold-light"
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen ? (
                    <motion.div id={panelId} initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="overflow-hidden">
                        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {meanings.map(({ word, meaning }, index: number) => (
                                <motion.div
                                    key={`${word}-${index}`}
                                    variants={itemVariants}
                                    className="rounded-2xl border border-gold-border/10 bg-shell-main/68 px-4 py-4 shadow-[0_12px_24px_-24px_rgba(0,0,0,0.4)] dark:border-dark-border/55 dark:bg-shell-main-dark/68"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-display text-[16px] italic text-gold-primary dark:text-gold-light">{word}</span>
                                        <span className="break-keep font-sans text-[13px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[14px]">
                                            {formatMeaning(meaning)}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    );
};
