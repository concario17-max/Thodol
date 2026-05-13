interface SutraContentProps {
    sanskrit: string;
    pronunciation: string;
    pronunciationKr?: string;
}

export const SutraContent = ({ sanskrit, pronunciation, pronunciationKr }: SutraContentProps) => {
    const cleanPronunciation = pronunciation?.replace(/\|+/g, '').replace(/\s+/g, ' ').trim();
    const cleanPronunciationKr = pronunciationKr
        ?.replace(/[｜|]/g, ' ')
        .replace(/-/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return (
        <section className="rounded-[1.2rem] border border-gold-border/16 bg-white/72 px-4 py-5 shadow-[0_18px_38px_-34px_rgba(0,0,0,0.35)] dark:border-dark-border/50 dark:bg-dark-surface/58 sm:px-5 sm:py-6">
            <div className="space-y-4 text-center">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/80 dark:text-gold-light/80">
                        Sanskrit text
                    </p>
                    <p className="whitespace-pre-line break-keep font-display text-[clamp(1.9rem,1.5rem+1.8vw,3.25rem)] leading-[1.38] tracking-[0.03em] text-sanskrit-accent dark:text-sanskrit-accent">
                        {sanskrit}
                    </p>
                </div>

                <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold-primary/55 to-transparent dark:via-gold-light/55" />

                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                        Pronunciation
                    </p>
                    <p className="whitespace-pre-line break-keep font-sans text-[12px] uppercase tracking-[0.18em] text-text-secondary dark:text-dark-text-secondary sm:text-[13px]">
                        {cleanPronunciation}
                    </p>
                    {cleanPronunciationKr ? (
                        <p className="whitespace-pre-line break-keep font-sans text-[13px] leading-8 tracking-[0.04em] text-text-secondary dark:text-dark-text-secondary sm:text-[14px]">
                            {cleanPronunciationKr}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
};
