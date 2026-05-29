import type { ReactNode } from 'react';

interface SutraSection {
    label: string;
    body?: string;
    tone?: 'hero' | 'pronunciation' | 'refined' | 'translation';
    trailing?: ReactNode;
    hideEmptyNotice?: boolean;
}

interface SutraContentProps {
    sections: SutraSection[];
}

const EMPTY_NOTICE = '아직 데이터가 없습니다.';

const normalizeText = (text?: string) => text?.replace(/\n{3,}/g, '\n\n').trim();

interface SectionClasses {
    section: string;
    header: string;
    body: string;
    pill?: string;
    divider?: string;
}

const getSectionClasses = (tone?: SutraSection['tone']): SectionClasses => {
    switch (tone) {
        case 'hero':
            return {
                section: 'py-5 text-center sm:py-6',
                header: 'hidden',
                body: 'mx-auto max-w-4xl font-display text-[clamp(1.6rem,1.4rem+0.9vw,2.55rem)] leading-[1.2] tracking-[0.01em] text-gold-primary dark:text-gold-light sm:leading-[1.18]',
            };
        case 'refined':
            return {
                section: 'py-6 text-center sm:py-7',
                header: 'flex items-center gap-2.5 border-b border-gold-border/8 pb-3 dark:border-dark-border/35',
                pill: 'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70',
                divider: 'h-px flex-1 bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20',
                body: 'mx-auto mt-3 max-w-4xl font-sans text-[13px] leading-7 tracking-[0.24em] text-text-secondary dark:text-dark-text-secondary sm:text-[14px]',
            };
        case 'pronunciation':
            return {
                section: 'py-6 text-center sm:py-7',
                header: 'flex items-center gap-2.5 border-b border-gold-border/8 pb-3 dark:border-dark-border/35',
                pill: 'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70',
                divider: 'h-px flex-1 bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20',
                body: 'mx-auto mt-3 max-w-[30rem] break-words hyphens-auto font-display text-[clamp(1rem,0.95rem+0.28vw,1.3rem)] leading-[1.58] tracking-[0.035em] text-text-primary dark:text-dark-text-primary sm:max-w-[34rem] sm:text-[1.08rem] lg:max-w-[38rem]',
            };
        case 'translation':
        default:
            return {
                section: 'py-5 text-left sm:py-6',
                header: 'flex items-center gap-2.5 border-b border-gold-border/8 pb-3 dark:border-dark-border/35',
                pill: 'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70',
                divider: 'h-px flex-1 bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20',
                body: 'mt-3 whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]',
            };
    }
};

export const SutraContent = ({ sections }: SutraContentProps) => {
    return (
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] bg-transparent px-1 py-1">
                <div className="space-y-0">
                    {sections.map((section, index) => {
                        const cleanBody = normalizeText(section.body);
                        const isLast = index === sections.length - 1;
                        const sectionClasses = getSectionClasses(section.tone);
                        const shouldHideEmptyNotice = section.hideEmptyNotice && !cleanBody;

                        return (
                            <section
                                key={section.label}
                                className={`${sectionClasses.section} ${index === 0 ? 'pt-0' : ''} ${
                                    !isLast ? 'border-b border-gold-border/8 dark:border-dark-border/25' : ''
                                }`}
                            >
                                {section.tone === 'hero' ? null : (
                                    <div className={sectionClasses.header}>
                                        <span className={sectionClasses.pill}>{section.label}</span>
                                        <span className={sectionClasses.divider} />
                                    </div>
                                )}
                                {section.tone === 'hero' ? (
                                    <p className={`flex items-center font-semibold uppercase text-gold-primary/70 dark:text-gold-light/70 ${sectionClasses.header}`}>
                                        {section.label}
                                    </p>
                                ) : null}
                                {shouldHideEmptyNotice ? null : <p className={sectionClasses.body}>{cleanBody || EMPTY_NOTICE}</p>}
                                {section.trailing ? <div className="mt-4">{section.trailing}</div> : null}
                            </section>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
