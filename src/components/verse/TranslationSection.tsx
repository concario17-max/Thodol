import type { ReactNode } from 'react';

interface TranslationSectionProps {
    label?: string;
    body?: string;
    note?: string;
    secondary?: string;
}

const Block = ({ label, children }: { label: string; children: ReactNode }) => (
    <section className="border-t border-gold-border/10 pt-4 dark:border-dark-border/45">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">{label}</p>
        <div className="mt-3 space-y-3">{children}</div>
    </section>
);

export const TranslationSection = ({ label = '번역', body, note, secondary }: TranslationSectionProps) => {
    const hasContent = Boolean(body || note || secondary);

    const emptyNotice = '아직 데이터가 없습니다.';

    return (
        <section className="mx-auto w-full space-y-4 px-4 sm:px-6 lg:px-8">
            {hasContent && body ? (
                <Block label={label}>
                    <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">
                        {body}
                    </p>
                </Block>
            ) : null}

            {hasContent && (note || secondary) ? (
                <Block label="보충 정보">
                    {note ? (
                        <p className="whitespace-pre-line break-keep font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                            {note}
                        </p>
                    ) : null}
                    {secondary ? (
                        <p className="whitespace-pre-line break-keep font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                            {secondary}
                        </p>
                    ) : null}
                </Block>
            ) : null}

            {!hasContent ? (
                <div className="rounded-[1.4rem] border border-gold-border/10 bg-white/55 px-4 py-4 text-left shadow-sm dark:border-dark-border/45 dark:bg-[#111]/35 sm:px-5 sm:py-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                        안내
                    </p>
                    <p className="mt-3 whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">
                        {emptyNotice}
                    </p>
                </div>
            ) : null}
        </section>
    );
};
