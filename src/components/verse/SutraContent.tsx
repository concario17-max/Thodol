interface SutraContentProps {
    title: string;
    subtitle?: string;
    body?: string;
}

export const SutraContent = ({ title, subtitle, body }: SutraContentProps) => {
    const cleanSubtitle = subtitle?.replace(/\s+/g, ' ').trim();
    const cleanBody = body?.replace(/\n{3,}/g, '\n\n').trim();

    return (
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="border-b border-gold-border/10 pb-5 text-center dark:border-dark-border/45">
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">
                    Title
                </p>
                <p className="mt-4 whitespace-pre-line break-keep font-display text-[clamp(1.55rem,1.3rem+1.1vw,2.65rem)] leading-[1.26] tracking-[0.015em] text-sanskrit-accent dark:text-sanskrit-accent">
                    {title}
                </p>
            </div>

            {cleanSubtitle ? (
                <div className="mt-4 space-y-3 text-center">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                            Subtitle
                        </p>
                        <p className="mt-2 whitespace-pre-line break-keep font-sans text-[13px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[14px]">
                            {cleanSubtitle}
                        </p>
                    </div>
                </div>
            ) : null}

            {cleanBody ? (
                <div className="mt-5 rounded-[1.4rem] border border-gold-border/10 bg-white/55 px-4 py-4 text-left shadow-sm dark:border-dark-border/45 dark:bg-[#111]/35 sm:px-5 sm:py-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                        Body
                    </p>
                    <p className="mt-3 whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">
                        {cleanBody}
                    </p>
                </div>
            ) : null}
        </section>
    );
};
