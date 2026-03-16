import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { WordMeaning } from '../../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface WordMeaningsProps {
    meanings?: WordMeaning;
}

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
                        <div className="mt-8 glass-panel rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {meanings.map(({ word, meaning }, index: number) => (
                                <motion.div 
                                    key={`${word}-${index}`} 
                                    variants={itemVariants}
                                    className="flex flex-col sm:flex-row sm:items-baseline py-3 border-b border-gold-primary/10 last:border-0 group"
                                >
                                    <span className="font-serif italic text-gold-primary dark:text-gold-light text-base sm:text-lg mb-1 sm:mb-0 sm:mr-4 flex-shrink-0">
                                        {word}
                                    </span>
                                    <span className="text-text-secondary dark:text-dark-text-secondary text-sm sm:text-[15px] leading-relaxed break-keep font-noto-kr">
                                        {meaning}
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
