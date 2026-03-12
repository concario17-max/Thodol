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
    oxfordEn
}: TranslationSectionProps) => (
    <>
        <section className="mb-10">
            <div className="flex items-center justify-center mb-6">
                <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
            </div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted text-center font-inter">Translation</h2>

            {english && (
                <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">English</h3>
                    <p className="text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-inter min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                        {english}
                    </p>
                </div>
            )}

            {korean1 && (
                <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">한국어 번역 1</h3>
                    <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                        {korean1}
                    </p>
                </div>
            )}

            {baeJik && (
                <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">배철현 (직역)</h3>
                    <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                        {baeJik}
                    </p>
                </div>
            )}

            {baeUu && (
                <div className="mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">배철현 (의역)</h3>
                    <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                        {baeUu}
                    </p>
                </div>
            )}

            {oxfordKr && (
                <div className="mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">Oxford 역</h3>
                    <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                        {oxfordKr}
                    </p>
                </div>
            )}
        </section>

        {oxfordEn && (
            <section className="mb-12">
                <div className="flex items-center justify-center mb-6">
                    <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
                </div>
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted text-center font-inter">Commentary</h2>
                <div className="text-base sm:text-lg leading-loose text-text-secondary dark:text-dark-text-secondary space-y-4 font-inter min-h-[1.5em] max-w-2xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                    {oxfordEn}
                </div>
            </section>
        )}
    </>
);
