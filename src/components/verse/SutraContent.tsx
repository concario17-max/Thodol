interface SutraContentProps {
    sanskrit: string;
    pronunciation: string;
    pronunciationKr?: string;
}

export const SutraContent = ({ sanskrit, pronunciation, pronunciationKr }: SutraContentProps) => {
    const cleanPronunciation = pronunciation?.replace(/\|+/g, '').replace(/\s+/g, ' ').trim();
    const cleanPronunciationKr = pronunciationKr?.replace(/[｜|]/g, ' ').replace(/-/g, '').replace(/\s+/g, ' ').trim();

    return (
        <section className="mx-auto w-full max-w-[58rem]">
            <div className="border-b border-gold-border/10 pb-4 text-center dark:border-dark-border/45">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-primary/70 dark:text-gold-light/70">
                    Sanskrit text
                </p>
                <p className="mt-3.5 whitespace-pre-line break-keep font-display text-[clamp(2rem,1.65rem+1.8vw,3.45rem)] leading-[1.36] tracking-[0.02em] text-sanskrit-accent dark:text-sanskrit-accent">
                    {sanskrit}
                </p>
            </div>

            <div className="mt-3 space-y-2.5 text-center">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                        Pronunciation
                    </p>
                    <p className="mt-1.5 whitespace-pre-line break-keep font-sans text-[11px] uppercase tracking-[0.16em] text-text-secondary dark:text-dark-text-secondary sm:text-[12px]">
                        {cleanPronunciation}
                    </p>
                </div>

                {cleanPronunciationKr ? (
                    <p className="whitespace-pre-line break-keep font-sans text-[13px] leading-[1.65] tracking-[0.03em] text-text-secondary dark:text-dark-text-secondary sm:text-[14px]">
                        {cleanPronunciationKr}
                    </p>
                ) : null}
            </div>
        </section>
    );
};
