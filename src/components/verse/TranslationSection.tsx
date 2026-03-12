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

            {/* Nicholas Sutton Section */}
            {(oxfordKr || oxfordEn) && (
                <div className="mb-12">
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light text-center font-inter">니콜라스 서튼</h2>
                    <div className="space-y-6 max-w-3xl mx-auto px-2 sm:px-0">
                        {oxfordEn && (
                            <p className="text-sm sm:text-base leading-relaxed text-text-secondary dark:text-dark-text-secondary text-center whitespace-pre-line break-keep font-inter">
                                {oxfordEn}
                            </p>
                        )}
                        {oxfordKr && (
                            <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep">
                                {oxfordKr}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center mb-10 opacity-30">
                <div className="w-12 h-px bg-gold-primary"></div>
            </div>

            {/* Bae Chul-hyun Section */}
            {(baeJik || baeUu) && (
                <div className="mb-12">
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light text-center font-inter">배철현</h2>
                    <div className="space-y-8 max-w-3xl mx-auto px-2 sm:px-0">
                        {baeJik && (
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold-muted dark:text-gold-muted text-center mb-2">직역</h3>
                                <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep">
                                    {baeJik}
                                </p>
                            </div>
                        )}
                        {baeUu && (
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold-muted dark:text-gold-muted text-center mb-2">의역</h3>
                                <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary text-center whitespace-pre-line break-keep">
                                    {baeUu}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>

        {/* Empty Commentary Section */}
        <section className="mb-12 opacity-20">
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-muted text-center font-inter">Commentary</h2>
            <div className="h-px w-24 mx-auto bg-gold-primary/20"></div>
        </section>
    </>
);
