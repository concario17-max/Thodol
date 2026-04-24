interface SutraContentProps {
    sanskrit: string;
    pronunciation: string;
    pronunciationKr?: string;
}

export const SutraContent = ({
    sanskrit,
    pronunciation,
    pronunciationKr,
}: SutraContentProps) => {
    // Clean pronunciation markers while keeping readable spacing.
    const cleanPronunciation = pronunciation?.replace(/\|+/g, '').replace(/\s+/g, ' ').trim();
    const cleanPronunciationKr = pronunciationKr
        ?.replace(/[｜|]/g, ' ')
        .replace(/-/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return (
        <>
            <section className="mx-auto mb-[var(--spacing-fluid-sm)] max-w-3xl px-4 text-center sm:px-6 lg:max-w-[52rem]">
                <p className="font-serif text-sanskrit-accent text-[var(--font-size-2xl)] md:text-[var(--font-size-3xl)] leading-relaxed whitespace-pre-line tracking-wide font-bold drop-shadow-sm">
                    {sanskrit}
                </p>
            </section>

            <section className="mx-auto mb-[var(--spacing-fluid-sm)] flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:max-w-[52rem]">
                <p className="font-serif italic text-[#B0A084] dark:text-[#D4C3A3] text-[var(--font-size-xs)] sm:text-[var(--font-size-sm)] leading-relaxed whitespace-pre-line tracking-[0.15em] uppercase mb-1 drop-shadow-sm">
                    {cleanPronunciation}
                </p>
            </section>

            {cleanPronunciationKr && (
                <section className="mx-auto mb-[var(--spacing-fluid-md)] max-w-3xl px-4 text-center sm:px-6 lg:max-w-[52rem]">
                    <p className="font-serif-kr italic text-[#B0A084] dark:text-[#D4C3A3] text-[var(--font-size-xs)] sm:text-[var(--font-size-sm)] leading-loose whitespace-pre-line tracking-[0.15em] drop-shadow-sm">
                        {cleanPronunciationKr}
                    </p>
                </section>
            )}

            <div className="mb-6"></div>
        </>
    );
};
