import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { SidebarLayout } from './ui/SidebarLayout';

type CommentaryBlock = {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    table?: {
        headers: [string, string];
        rows: Array<{
            label: string;
            value: string;
        }>;
    };
};

const verseOneFiveBlocks: CommentaryBlock[] = [
    {
        title: '🧠 마음의 상태와 치타 제어의 원리',
        paragraphs: [
            '내적 인간이 체험하는 마음의 상태는 크게 다섯 가지로 나뉘며, 근본적으로 쾌락이나 고통 같은 기본적인 감각에 종속돼. 이 상태들은 우리에게 고통스럽거나, 기쁘거나, 혹은 아무렇지 않은 단일한 상태로 인식되지.',
            '💡 비유하자면 마음은 투명한 도화지이고, 쾌락과 고통은 거기에 칠해지는 단색 물감과 같아. 한순간에 내 눈앞에 보이는 도화지의 색깔은 붉은색이거나 푸른색인 것처럼 단일한 느낌으로 다가오는 거야.',
        ],
    },
    {
        title: '⚖️ 통증의 주관성과 혼탁한 감각',
        paragraphs: [
            '객관적으로 정해져 있는 절대적인 고통이란 존재하지 않아. 통증은 단순히 내가 견딜 수 있는 응력 이상의 자극일 뿐이거든.',
            '💡 10kg의 덤벨이 어린아이에게는 버거운 고통이지만 역도 선수에게는 가벼운 자극인 것과 같아. 내가 견딜 수 있는 힘의 크기에 따라 통증이라는 주관적 판단이 결정되는 거지.',
        ],
        table: {
            headers: ['감각의 분류', '특징 및 발생 원인'],
            rows: [
                {
                    label: '순수한 통증',
                    value: '개인이 견딜 수 있는 한계치를 넘어서는 물리적 또는 심리적 자극',
                },
                {
                    label: '혼탁한 감각',
                    value: '비터스위트 현상처럼 감각에 주관적인 판단과 오염된 사고가 개입된 섞인 상태',
                },
            ],
        },
    },
    {
        title: '🧘 치타 통제와 직관적 지혜의 발현',
        paragraphs: [
            '가장 중요한 핵심은 지금 느끼는 감각이 괴로운지 아닌지를 따지는 게 아니라, 그것을 통제하고 정화하는 행위 그 자체야.',
            '💡 거친 파도가 치든 날씨가 화창하든 바다를 항해하는 선장은 조타수를 꽉 잡고 통제해야 하는 것과 같아. 날씨가 좋은지 나쁜지가 중요한 게 아니라 배의 운전대를 제어하는 행위가 본질이지.',
        ],
        bullets: [
            '불쾌함이나 유쾌함에 흔들리지 않고 마음을 다루는 데에만 집중해야 함',
            '치타를 정복하고 다루다 보면 자연스럽게 마음에 평화가 찾아옴',
            '경험을 넘어, 알지 못하던 것을 저절로 인식하게 되는 직관적 지혜가 생겨남',
        ],
    },
    {
        title: '🔍 식별과 확신의 필요성',
        paragraphs: [
            '마음의 상태를 다섯 가지로 분류하는 것처럼 본질을 꿰뚫는 가르침은 무조건 믿기보다 스스로 증명하는 과정이 필수적이야.',
        ],
        bullets: [
            '원인을 꿰뚫은 가르침이라도 단순한 신뢰를 넘어선 스스로의 식별 작업이 요구됨',
            '스스로 확인하고 확증할 때 내면에 진정한 확신이 자리 잡을 수 있음',
        ],
    },
    {
        title: '📝 핵심 요약',
        bullets: [
            '마음의 상태는 쾌락과 고통에 종속되며 개인에게는 단일한 상태로 나타남',
            '통증은 객관적 실체가 아니라 개인의 인내 한계를 넘은 주관적 자극임',
            '감각의 좋고 나쁨을 따지기보다 치타를 제어하고 통제하는 것 자체가 목적임',
            '마음을 제어하면 평화와 함께 저절로 직관적 지혜가 피어남',
            '진정한 깨달음은 맹신이 아니라 스스로 식별하고 확증하여 얻는 내면의 확신에서 옴',
        ],
    },
];

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel } = useUI();

    if (!chapterNum || !verseNum) {
        return null;
    }

    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';
    const isVerseOneFive = chapterNum === '1' && verseNum === '5';

    return (
        <SidebarLayout
            isOpen={isOpen}
            isDesktopOpen={isDesktopOpen}
            onClose={() => setActiveRightPanel(null)}
            title="Commentary"
            position="right"
            widthClass="w-[90vw] max-w-[400px]"
            desktopWidthClass="lg:w-full"
        >
            <div className="relative flex h-full min-h-0 flex-col p-6">
                <div className="mb-6 flex shrink-0 items-center gap-2 border-b border-gold-border/30 pb-4">
                    <MessageSquare className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                    <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
                </div>

                <div className="mb-2 text-xs font-bold tracking-wider text-[#8FA0AD]">
                    {chapterNum}.{verseNum}
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto rounded-2xl border border-gold-primary/20 bg-white/70 p-5 shadow-inner backdrop-blur-sm transition-all dark:border-dark-border/60 dark:bg-dark-bg/60">
                    {isVerseOneFive ? (
                        <div className="space-y-6">
                            {verseOneFiveBlocks.map((block) => (
                                <section key={block.title} className="space-y-3 rounded-2xl border border-gold-border/20 bg-white/65 p-4 dark:border-dark-border/50 dark:bg-dark-surface/55">
                                    <h3 className="text-sm font-semibold text-[#1C2B36] dark:text-dark-text-primary">{block.title}</h3>

                                    {block.paragraphs?.map((paragraph) => (
                                        <p key={paragraph} className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                                            {paragraph}
                                        </p>
                                    ))}

                                    {block.table ? (
                                        <div className="overflow-hidden rounded-xl border border-gold-border/20 bg-white/75 dark:border-dark-border/50 dark:bg-dark-bg/60">
                                            <div className="grid grid-cols-2 border-b border-gold-border/20 bg-gold-surface/40 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:bg-dark-surface/80 dark:text-gold-light">
                                                <div className="px-3 py-2">{block.table.headers[0]}</div>
                                                <div className="border-l border-gold-border/20 px-3 py-2 dark:border-dark-border/50">{block.table.headers[1]}</div>
                                            </div>
                                            {block.table.rows.map((row) => (
                                                <div key={row.label} className="grid grid-cols-2 border-b border-gold-border/10 last:border-b-0">
                                                    <div className="px-3 py-3 text-sm font-medium text-text-primary dark:text-dark-text-primary">{row.label}</div>
                                                    <div className="border-l border-gold-border/10 px-3 py-3 text-sm leading-relaxed text-text-secondary dark:border-dark-border/40 dark:text-dark-text-secondary">
                                                        {row.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}

                                    {block.bullets ? (
                                        <ul className="space-y-2 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                                            {block.bullets.map((item) => (
                                                <li key={item} className="rounded-xl border border-gold-border/20 bg-white/60 px-3 py-2.5 dark:bg-dark-surface/60">
                                                    · {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </section>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">내용 없음</p>
                                <p>새 코멘타리 원고를 여기로 넣을 예정입니다.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
};

export default CommentarySidebar;
