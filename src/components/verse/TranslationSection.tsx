interface TranslationSectionProps {
    english?: string;
    korean1?: string;
    baeJik?: string;
    baeUu?: string;
    oxfordKr?: string;
    oxfordEn?: string;
}

export const TranslationSection = ({ english, korean1, baeJik, baeUu, oxfordKr, oxfordEn }: TranslationSectionProps) => (
    <section className="mb-8 sm:mb-10">
        <div className="mb-5 flex items-center justify-center sm:mb-6">
            <span className="text-xs tracking-[8px] text-gold-muted/40 dark:text-gold-muted/30">번역문</span>
        </div>

        <div className="mb-[var(--spacing-fluid-lg)]">
            <h2 className="mb-[var(--spacing-fluid-sm)] text-center font-pretendard text-[var(--font-size-xs)] font-semibold uppercase tracking-[0.18em] text-gold-primary opacity-80 dark:text-gold-light">
                앨리스 A. 베일리
            </h2>
            <div className="mx-auto max-w-3xl space-y-[var(--spacing-fluid-sm)] px-3 sm:px-6 lg:max-w-[52rem] lg:px-8">
                {english && <p className="whitespace-pre-line break-keep font-sans text-[var(--font-size-base)] leading-relaxed text-text-primary dark:text-dark-text-primary lg:text-[var(--font-size-lg)]">{english}</p>}
                {korean1 && <p className="whitespace-pre-line break-keep font-sans text-[var(--font-size-base)] font-medium leading-relaxed text-text-primary dark:text-dark-text-primary lg:text-[var(--font-size-lg)]">{korean1}</p>}
            </div>
        </div>

        <div className="mb-8 flex items-center justify-center opacity-30 sm:mb-10">
            <div className="h-px w-12 bg-gold-primary" />
        </div>

        {(oxfordKr || oxfordEn) && (
            <div className="mb-[var(--spacing-fluid-lg)]">
                <h2 className="mb-[var(--spacing-fluid-sm)] text-center font-pretendard text-[var(--font-size-xs)] font-semibold uppercase tracking-[0.18em] text-gold-primary opacity-80 dark:text-gold-light">
                    니콜라스 서튼
                </h2>
                <div className="mx-auto max-w-3xl space-y-[var(--spacing-fluid-sm)] px-3 sm:px-6 lg:max-w-[52rem] lg:px-8">
                    {oxfordEn && <p className="whitespace-pre-line break-keep font-sans text-[var(--font-size-base)] leading-relaxed text-text-primary dark:text-dark-text-primary lg:text-[var(--font-size-lg)]">{oxfordEn}</p>}
                    {oxfordKr && <p className="whitespace-pre-line break-keep font-sans text-[var(--font-size-base)] font-medium leading-relaxed text-text-primary dark:text-dark-text-primary lg:text-[var(--font-size-lg)]">{oxfordKr}</p>}
                </div>
            </div>
        )}

        <div className="mb-8 flex items-center justify-center opacity-30 sm:mb-10">
            <div className="h-px w-12 bg-gold-primary" />
        </div>

        {(baeJik || baeUu) && (
            <div className="mb-[var(--spacing-fluid-lg)]">
                <h2 className="mb-[var(--spacing-fluid-sm)] text-center font-pretendard text-[var(--font-size-xs)] font-semibold uppercase tracking-[0.18em] text-gold-primary opacity-80 dark:text-gold-light">
                    배철현
                </h2>
                <div className="mx-auto max-w-3xl space-y-[var(--spacing-fluid-md)] px-3 sm:px-6 lg:max-w-[52rem] lg:px-8">
                    {baeJik && (
                        <div>
                            <h3 className="mb-1.5 text-center font-sans text-[11px] font-bold uppercase tracking-widest text-gold-muted opacity-70 dark:text-gold-muted">직역</h3>
                            <p className="whitespace-pre-line break-keep font-sans text-[var(--font-size-base)] font-medium leading-relaxed text-text-primary dark:text-dark-text-primary lg:text-[var(--font-size-lg)]">{baeJik}</p>
                        </div>
                    )}
                    {baeUu && (
                        <div>
                            <h3 className="mb-1.5 text-center font-sans text-[11px] font-bold uppercase tracking-widest text-gold-muted opacity-70 dark:text-gold-muted">의역</h3>
                            <p className="whitespace-pre-line break-keep font-sans text-[var(--font-size-base)] font-medium leading-relaxed text-text-primary dark:text-dark-text-primary lg:text-[var(--font-size-lg)]">{baeUu}</p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </section>
);
