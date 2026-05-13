import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { WordMeaning } from '../../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

const containerVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: {
            height: { duration: 0.45, ease: [0.2, 0, 0, 1] },
            opacity: { duration: 0.25 },
            staggerChildren: 0.04,
            delayChildren: 0.08,
        },
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: {
            height: { duration: 0.35, ease: [0.2, 0, 0, 1] },
            opacity: { duration: 0.2 },
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
};

export const WordMeanings = ({ meanings }: WordMeaningsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!meanings || meanings.length === 0) return null;

    return (
        <section className="rounded-[1.2rem] border border-gold-border/16 bg-white/72 px-4 py-4 shadow-[0_18px_38px_-34px_rgba(0,0,0,0.35)] dark:border-dark-border/50 dark:bg-dark-surface/58 sm:px-5">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-3 rounded-[0.95rem] border border-gold-border/14 bg-white/66 px-4 py-3 text-left transition-all duration-300 hover:border-gold-primary/30 hover:bg-white/82 active:scale-[0.99] dark:border-dark-border/45 dark:bg-dark-surface/55 dark:hover:border-gold-primary/22"
            >
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/80 dark:text-gold-light/80">
                        Word meanings
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-text-primary dark:text-dark-text-primary">
                        Tap to expand the lexical breakdown
                    </p>
                </div>

                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-border/16 text-gold-primary dark:border-dark-border/45 dark:text-gold-light"
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen ? (
                    <motion.div initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="overflow-hidden">
                        <div className="mt-4 grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {meanings.map(({ word, meaning }, index: number) => (
                                <motion.div
                                    key={`${word}-${index}`}
                                    variants={itemVariants}
                                    className="rounded-[0.95rem] border border-gold-border/14 bg-white/60 px-4 py-3 dark:border-dark-border/40 dark:bg-dark-surface/55"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-display text-[16px] italic text-gold-primary dark:text-gold-light">
                                            {word}
                                        </span>
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
