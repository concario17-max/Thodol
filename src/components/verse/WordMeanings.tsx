import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { WordMeaning } from '../../types';

interface WordMeaningsProps {
    meanings?: WordMeaning;
}

export const WordMeanings = ({ meanings }: WordMeaningsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!meanings || meanings.length === 0) return null;

    return (
        <div className="w-full mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex flex-col items-center group transition-all duration-500"
            >
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-primary/60 group-hover:text-gold-primary transition-colors mb-2">
                    Word-by-word
                </span>
                <div className="w-8 h-8 rounded-full border border-gold-primary/20 flex items-center justify-center group-hover:border-gold-primary/40 transition-all duration-500 group-hover:scale-110">
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gold-primary" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gold-primary" />
                    )}
                </div>
            </button>

            <div 
                className={`grid transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)] ${
                    isOpen ? 'grid-template-rows-[1fr] opacity-100 mt-8' : 'grid-template-rows-[0fr] opacity-0'
                }`}
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    {/* 2-column layout on desktop, single on mobile. Grid-cols-1 vs md:grid-cols-2 */}
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {meanings.map(({ word, meaning }, index) => (
                            <div 
                                key={`${word}-${index}`} 
                                className="flex flex-col sm:flex-row sm:items-baseline py-3 border-b border-gold-primary/10 last:border-0 group"
                                style={{ 
                                    animation: isOpen ? `reveal 0.6s var(--transition-lazy) ${index * 0.05}s forwards` : 'none',
                                    opacity: 0 
                                }}
                            >
                                <span className="font-serif italic text-gold-primary dark:text-gold-light text-base sm:text-lg mb-1 sm:mb-0 sm:mr-4 flex-shrink-0">
                                    {word}
                                </span>
                                <span className="text-text-secondary dark:text-dark-text-secondary text-sm sm:text-[15px] leading-relaxed break-keep font-noto-kr">
                                    {meaning}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
