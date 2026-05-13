import type { ReactNode } from 'react';

interface TranslationSectionProps {
    baeJik?: string;
    baeUu?: string;
    oxfordKr?: string;
    oxfordEn?: string;
}

const Card = ({ label, children }: { label: string; children: ReactNode }) => (
    <section className="rounded-[1.15rem] border border-gold-border/16 bg-white/72 p-4 shadow-[0_18px_38px_-34px_rgba(0,0,0,0.35)] dark:border-dark-border/50 dark:bg-dark-surface/58 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/80 dark:text-gold-light/80">{label}</p>
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
        <section className="space-y-4">
            {hasOxford ? (
                <Card label="Oxford translation">
                    {oxfordEn ? <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">{oxfordEn}</p> : null}
                    {oxfordKr ? <p className="whitespace-pre-line break-keep font-sans text-[15px] font-medium leading-8 text-text-secondary dark:text-dark-text-secondary sm:text-[16px]">{oxfordKr}</p> : null}
                </Card>
            ) : null}

            {hasBae ? (
                <Card label="Baejik / Baeuu">
                    {baeJik ? (
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                                Baejik
                            </p>
                            <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">{baeJik}</p>
                        </div>
                    ) : null}
                    {baeUu ? (
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                                Baeuu
                            </p>
                            <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">{baeUu}</p>
                        </div>
                    ) : null}
                </Card>
            ) : null}
        </section>
    );
};
