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
            
            {/* Alice A. Bailey Section */}
            <div className="mb-12">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light text-center font-inter">앨리스 A. 베일리</h2>
                <div className="space-y-6 max-w-3xl mx-auto px-2 sm:px-0">
                    {english && (
                        <p className="text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-inter text-center whitespace-pre-line break-keep">
                            {english}
                        </p>
                    )}
                    {korean1 && (
                        <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep border-t border-gold-primary/10 pt-6">
                            {korean1}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center mb-10 opacity-30">
                <div className="w-12 h-px bg-gold-primary"></div>
            </div>

            {/* Bae Chul-hyun Section */}
            {(baeJik || baeUu) && (
                <div className="mb-12">
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted text-center font-inter">배철현</h2>
                    <div className="space-y-8 max-w-3xl mx-auto px-2 sm:px-0">
                        {baeJik && (
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold-primary/50 text-center mb-2">직역</h3>
                                <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep">
                                    {baeJik}
                                </p>
                            </div>
                        )}
                        {baeUu && (
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold-primary/50 text-center mb-2">의역</h3>
                                <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep">
                                    {baeUu}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center mb-10 opacity-30">
                <div className="w-12 h-px bg-gold-primary"></div>
            </div>

            {/* Nicholas Sutton Section */}
            <div className="mb-4">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light text-center font-inter">니콜라스 서튼</h2>
                <div className="space-y-6 max-w-3xl mx-auto px-2 sm:px-0">
                    {oxfordKr && (
                        <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep">
                            {oxfordKr}
                        </p>
                    )}
                </div>
            </div>
        </section>

        {/* Unified Commentary Section for Sutton */}
        <section className="mb-12">
            <div className="flex items-center justify-center mb-6">
                <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
            </div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted text-center font-inter">Commentary</h2>
            <div className="text-base sm:text-lg leading-loose text-text-secondary dark:text-dark-text-secondary space-y-4 font-inter min-h-[1.5em] max-w-2xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep text-center">
                {oxfordEn || ""}
            </div>
        </section>
    </>
);
