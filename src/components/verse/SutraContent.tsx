interface SutraContentProps {
    sanskrit: string;
    pronunciation: string;
    pronunciationKr?: string;
}

export const SutraContent = ({
    sanskrit,
    pronunciation,
    pronunciationKr
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

        <div className="mb-6"></div>
    </>
);
