interface SutraSection {
    label: string;
    body?: string;
    tone?: 'hero' | 'refined' | 'translation';
}

interface SutraContentProps {
    sections: SutraSection[];
}

const EMPTY_NOTICE = '아직 데이터가 없습니다.';

const normalizeText = (text?: string) => text?.replace(/\n{3,}/g, '\n\n').trim();

const getSectionClasses = (tone?: SutraSection['tone']) => {
    switch (tone) {
        case 'hero':
            return {
                section: 'py-7 text-center sm:py-8',
                label: 'hidden',
                body: 'mx-auto max-w-4xl font-display text-[clamp(1.6rem,1.4rem+0.9vw,2.55rem)] leading-[1.2] tracking-[0.01em] text-gold-primary dark:text-gold-light sm:leading-[1.18]',
            };
        case 'refined':
            return {
                section: 'py-6 text-center sm:py-7',
                label: 'justify-center text-[10px] tracking-[0.42em]',
                body: 'mx-auto max-w-4xl font-sans text-[13px] leading-7 tracking-[0.24em] text-text-secondary dark:text-dark-text-secondary sm:text-[14px]',
            };
        case 'translation':
        default:
            return {
                section: 'py-5 text-left sm:py-6',
                label: 'justify-start text-[10px] tracking-[0.34em]',
                body: 'whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]',
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

                        return (
                            <section
                                key={section.label}
                                className={`${sectionClasses.section} ${index === 0 ? 'pt-2' : ''} ${
                                    !isLast ? 'border-b border-gold-border/8 dark:border-dark-border/25' : ''
                                }`}
                            >
                                <p className={`flex items-center font-semibold uppercase text-gold-primary/70 dark:text-gold-light/70 ${sectionClasses.label}`}>
                                    {section.label}
                                </p>
                                <p className={`mt-3 ${sectionClasses.body}`}>{cleanBody || EMPTY_NOTICE}</p>
                            </section>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
