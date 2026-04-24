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
            height: { duration: 0.5, ease: [0.2, 0, 0, 1] },
            opacity: { duration: 0.3 },
            staggerChildren: 0.04,
            delayChildren: 0.1
        }
    },
    exit: { 
        opacity: 0, 
        height: 0,
        transition: { 
            height: { duration: 0.4, ease: [0.2, 0, 0, 1] },
            opacity: { duration: 0.2 }
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

export const WordMeanings = ({ meanings }: WordMeaningsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!meanings || meanings.length === 0) return null;

    return (
        <div className="w-full mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex flex-col items-center group transition-all duration-500 active:scale-95"
            >
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-primary/60 group-hover:text-gold-primary transition-colors mb-2">
                    Word-by-word
                </span>
                <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                    className="w-8 h-8 rounded-full border border-gold-primary/20 flex items-center justify-center group-hover:border-gold-primary/40 transition-all duration-500 group-hover:scale-110"
                >
                    <ChevronDown className="w-4 h-4 text-gold-primary" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                        className="overflow-hidden"
                    >
                        <div className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-1 gap-x-6 gap-y-3 rounded-2xl px-4 py-5 sm:px-5 sm:py-6 md:grid-cols-2 lg:grid-cols-3">
                            {meanings.map(({ word, meaning }, index: number) => (
                                <motion.div 
                                    key={`${word}-${index}`} 
                                    variants={itemVariants}
                                    className="group flex flex-col border-b border-gold-primary/10 py-2.5 last:border-0 sm:flex-row sm:items-baseline sm:py-2"
                                >
                                    <span className="mb-1 flex-shrink-0 font-serif text-base italic text-gold-primary dark:text-gold-light sm:mb-0 sm:mr-3 sm:text-lg">
                                        {word}
                                    </span>
                                    <span className="break-keep font-noto-kr text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                                        {formatMeaning(meaning)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
