import type { ReactNode } from 'react';

interface TranslationSectionProps {
    baeJik?: string;
    baeUu?: string;
    oxfordKr?: string;
    oxfordEn?: string;
}

const Block = ({ label, children }: { label: string; children: ReactNode }) => (
    <section className="border-t border-gold-border/10 pt-4 dark:border-dark-border/45">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">{label}</p>
        <div className="mt-3 space-y-3">{children}</div>
    </section>
);

export const TranslationSection = ({ baeJik, baeUu, oxfordKr, oxfordEn }: TranslationSectionProps) => {
    const hasOxford = Boolean(oxfordKr || oxfordEn);
    const hasBae = Boolean(baeJik || baeUu);

    if (!hasOxford && !hasBae) {
        return null;
    }

    return (
        <section className="mx-auto w-full max-w-[58rem] space-y-4">
            {hasOxford ? (
                <Block label="Oxford translation">
                    {oxfordEn ? <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">{oxfordEn}</p> : null}
                    {oxfordKr ? <p className="whitespace-pre-line break-keep font-sans text-[15px] font-medium leading-8 text-text-secondary dark:text-dark-text-secondary sm:text-[16px]">{oxfordKr}</p> : null}
                </Block>
            ) : null}

            {hasBae ? (
                <Block label="Baejik / Baeuu">
                    {baeJik ? (
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary/65 dark:text-dark-text-secondary/65">
                                Baejik
                            </p>
                            <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">{baeJik}</p>
                        </div>
                    ) : null}
                    {baeUu ? (
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary/65 dark:text-dark-text-secondary/65">
                                Baeuu
                            </p>
                            <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">{baeUu}</p>
                        </div>
                    ) : null}
                </Block>
            ) : null}
        </section>
    );
};
