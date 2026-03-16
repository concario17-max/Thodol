interface SutraContentProps {
    sanskrit: string;
    pronunciation: string;
    pronunciationKr?: string;
}

export const SutraContent = ({
    sanskrit,
    pronunciation,
    pronunciationKr
}: SutraContentProps) => {
    // 발음 기호 정제 로직
    const cleanPronunciation = pronunciation?.replace(/\|+/g, '').replace(/\s+/g, ' ').trim();
    const cleanPronunciationKr = pronunciationKr?.replace(/-/g, '').replace(/｜/g, ' ').replace(/\s+/g, ' ').trim();

    return (
        <>
            <section className="mb-4 text-center px-4 sm:px-6 max-w-3xl mx-auto">
                <p className="font-serif text-[#8B6508] dark:text-[#B8860B] text-lg sm:text-2xl md:text-[28px] leading-relaxed whitespace-pre-line tracking-wide font-bold drop-shadow-sm">
                    {sanskrit}
                </p>
            </section>

            <section className="mb-2 text-center flex flex-col items-center px-4 sm:px-6 max-w-3xl mx-auto">
                <p className="font-serif italic text-[#B0A084] dark:text-[#D4C3A3] text-xs sm:text-[14px] leading-relaxed whitespace-pre-line tracking-[0.15em] uppercase mb-1 drop-shadow-sm">
                    {cleanPronunciation}
                </p>
            </section>

            {cleanPronunciationKr && (
                <section className="mb-8 text-center px-4 sm:px-6 max-w-3xl mx-auto">
                    <p className="font-serif-kr italic text-[#B0A084] dark:text-[#D4C3A3] text-xs sm:text-[14px] leading-loose whitespace-pre-line tracking-[0.15em] drop-shadow-sm">
                        {cleanPronunciationKr}
                    </p>
                </section>
            )}

            <div className="mb-6"></div>
        </>
    );
};
