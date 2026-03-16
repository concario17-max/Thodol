interface TranslationSectionProps {
    english?: string;
    korean1?: string;
    baeJik?: string;
    baeUu?: string;
    oxfordKr?: string;
    oxfordEn?: string;
}

export const TranslationSection = ({
    english,
    korean1,
    baeJik,
    baeUu,
    oxfordKr,
    oxfordEn,
}: TranslationSectionProps) => (
    <section className="mb-10">
        <div className="flex items-center justify-center mb-6">
            <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
        </div>

        <div className="mb-[var(--spacing-fluid-lg)]">
            <h2 className="mb-[var(--spacing-fluid-sm)] text-[var(--font-size-xs)] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light text-center font-pretendard opacity-80">
                앨리스 A. 베일리
            </h2>
            <div className="space-y-[var(--spacing-fluid-sm)] max-w-3xl mx-auto px-4 sm:px-6">
                {english && (
                    <p className="text-[var(--font-size-base)] lg:text-[var(--font-size-lg)] leading-relaxed text-text-primary dark:text-dark-text-primary font-sans text-center whitespace-pre-line break-keep">
                        {english}
                    </p>
                )}
                {korean1 && (
                    <p className="font-sans text-[var(--font-size-base)] lg:text-[var(--font-size-lg)] leading-relaxed text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep font-medium">
                        {korean1}
                    </p>
                )}
            </div>
        </div>

        <div className="flex items-center justify-center mb-10 opacity-30">
            <div className="w-12 h-px bg-gold-primary"></div>
        </div>

        {(oxfordKr || oxfordEn) && (
            <div className="mb-[var(--spacing-fluid-lg)]">
                <h2 className="mb-[var(--spacing-fluid-sm)] text-[var(--font-size-xs)] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light text-center font-pretendard opacity-80">
                    니콜라스 서튼
                </h2>
                <div className="space-y-[var(--spacing-fluid-sm)] max-w-3xl mx-auto px-4 sm:px-6">
                    {oxfordEn && (
                        <p className="font-sans text-[var(--font-size-base)] lg:text-[var(--font-size-lg)] leading-relaxed text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep">
                            {oxfordEn}
                        </p>
                    )}
                    {oxfordKr && (
                        <p className="font-sans text-[var(--font-size-base)] lg:text-[var(--font-size-lg)] leading-relaxed text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep font-medium">
                            {oxfordKr}
                        </p>
                    )}
                </div>
            </div>
        )}

        <div className="flex items-center justify-center mb-10 opacity-30">
            <div className="w-12 h-px bg-gold-primary"></div>
        </div>

        {(baeJik || baeUu) && (
            <div className="mb-[var(--spacing-fluid-lg)]">
                <h2 className="mb-[var(--spacing-fluid-sm)] text-[var(--font-size-xs)] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light text-center font-pretendard opacity-80">
                    배철현
                </h2>
                <div className="space-y-[var(--spacing-fluid-md)] max-w-3xl mx-auto px-4 sm:px-6">
                    {baeJik && (
                        <div>
                            <h3 className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold-muted dark:text-gold-muted text-center mb-1.5 opacity-70">
                                직역
                            </h3>
                            <p className="font-sans text-[var(--font-size-base)] lg:text-[var(--font-size-lg)] leading-relaxed text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep font-medium">
                                {baeJik}
                            </p>
                        </div>
                    )}
                    {baeUu && (
                        <div>
                            <h3 className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold-muted dark:text-gold-muted text-center mb-1.5 opacity-70">
                                의역
                            </h3>
                            <p className="font-sans text-[var(--font-size-base)] lg:text-[var(--font-size-lg)] leading-relaxed text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep font-medium">
                                {baeUu}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </section>
);
