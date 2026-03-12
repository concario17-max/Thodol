import { ChevronDown, ChevronUp } from 'lucide-react';
import { Token } from '../../types';

interface SutraContentProps {
    sanskrit: string;
    pronunciation: string;
    pronunciationKr?: string;
    tokens?: Token[];
    showLexicon: boolean;
    onToggleLexicon: () => void;
}

export const SutraContent = ({
    sanskrit,
    pronunciation,
    pronunciationKr,
    tokens,
    showLexicon,
    onToggleLexicon
}: SutraContentProps) => (
    <>
        <section className="mb-4 text-center px-2 sm:px-0">
            <p className="font-noto text-[#8C3A3A] dark:text-[#E8A586] text-xl sm:text-2xl leading-normal whitespace-pre-line tracking-wide font-bold drop-shadow-sm">
                {sanskrit}
            </p>
        </section>

        <section className="mb-2 text-center flex flex-col items-center">
            <p className="font-noto italic text-[#B0A084] dark:text-[#D4C3A3] text-[14px] leading-snug whitespace-pre-line tracking-[0.15em] uppercase mb-1 drop-shadow-sm">
                {pronunciation}
            </p>
        </section>

        {pronunciationKr && (
            <section className="mb-8 text-center">
                <p className="font-noto-kr italic text-[#B0A084] dark:text-[#D4C3A3] text-[14px] leading-relaxed whitespace-pre-line tracking-[0.15em] drop-shadow-sm">
                    {pronunciationKr}
                </p>
            </section>
        )}

        <section className="mb-10">
            <div className="flex items-center justify-center mb-6">
                <button
                    onClick={onToggleLexicon}
                    className="group flex flex-col items-center gap-1.5 focus:outline-none"
                >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted group-hover:text-gold-primary transition-colors font-inter">
                        Word-by-Word
                    </span>
                    <div className="w-6 h-6 rounded-full border border-gold-primary/20 bg-white/20 dark:bg-dark-surface/20 flex items-center justify-center group-hover:border-gold-primary/50 transition-colors">
                        {showLexicon ? (
                            <ChevronUp className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                        )}
                    </div>
                </button>
            </div>

            <div className={`transition-all duration-500 overflow-hidden ${showLexicon ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-4xl mx-auto px-2 sm:px-4">
                    {tokens?.map((token, i) => {
                        const cleanMeaning = token.meaning_ko.replace(/^—\s*/, '').trim();
                        return (
                            <div key={i} className="flex flex-col px-3 py-2 rounded-xl bg-white/30 dark:bg-dark-bg/40 backdrop-blur-sm border border-gold-primary/10 dark:border-dark-border/50 shadow-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <span className="font-bold text-text-primary dark:text-dark-text-primary text-[15px] font-crimson mb-0.5">{token.surface}</span>
                                <span className="text-text-secondary dark:text-dark-text-secondary text-[13px] font-inter leading-relaxed break-keep">{cleanMeaning}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    </>
);
