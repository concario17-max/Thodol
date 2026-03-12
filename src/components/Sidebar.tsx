import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { YOGA_CHAPTERS_META } from '../constants';
import { useUI } from '../context/UIContext';
import { fetchYogaData } from '../utils/dataFetcher';
import { YogaChapter } from '../types';
import { SidebarLayout } from './ui/SidebarLayout';
import { SidebarMenu, NavGroupType, NavItemType } from './ui/SidebarMenu';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const [chapters, setChapters] = useState<YogaChapter[]>([]);
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchYogaData()
            .then(data => {
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data) as unknown as YogaChapter[];
                    setChapters(chapterArray);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(parseInt(chapterNum));
        }
    }, [chapterNum]);

    const toggleChapter = (chNum: number) => {
        setExpandedChapter(chNum);
        navigate(`/chapter/${chNum}/verse/1`);
    };

    const currentChapter = chapters.find(ch => ch.chapter === expandedChapter);

    // 라우팅 데이터를 범용 NavGroups 포맷으로 변환 (Zero Monolith Logic Extraction)
    const groups: NavGroupType[] = chapters.map(ch => {
        const titleRaw = YOGA_CHAPTERS_META[ch.chapter]?.name_korean || ch.meta?.name_korean || "";
        const hasSub = titleRaw.includes('(');
        const mainTitle = hasSub ? titleRaw.substring(0, titleRaw.indexOf('(')).trim() : titleRaw;
        const subTitle = hasSub ? titleRaw.substring(titleRaw.indexOf('(')).trim() : undefined;

        const isExpanded = expandedChapter === ch.chapter;

        // items are dynamically built if the chapter is expanded, to save processing, 
        // or we build everything. Building what is current chapter is fine.
        let items: NavItemType[] = [];
        if (isExpanded && currentChapter) {
            items = currentChapter.sutras.map((s, idx) => {
                const parts = s.id.split('.');
                const sutraNumText = parts[1];
                const sutraNum = parseInt(sutraNumText, 10);

                const nextS = currentChapter.sutras[idx + 1];
                let displaySutra = `${ch.chapter}.${sutraNumText}`;

                if (nextS) {
                    const nextSutraNum = parseInt(nextS.id.split('.')[1], 10);
                    if (nextSutraNum > sutraNum + 1) {
                        displaySutra = `${ch.chapter}.${sutraNum}-${nextSutraNum - 1}`;
                    }
                }

                const sutraText = s.sanskrit ? s.sanskrit.split('\n')[0].substring(0, 40) + '...' : `Sutra ${sutraNumText}`;
                const isActive = ch.chapter === parseInt(chapterNum || '1') && sutraNumText === verseNum;

                return {
                    id: String(sutraNum),
                    label: displaySutra,
                    href: `/chapter/${ch.chapter}/verse/${sutraNumText}`,
                    description: sutraText,
                    isActive
                };
            });
        }

        return {
            id: ch.chapter,
            title: `${ch.chapter}. ${mainTitle}`,
            subtitle: subTitle,
            badge: ch.sutras.length,
            isExpanded,
            onToggle: () => toggleChapter(ch.chapter),
            items
        };
    });

    return (
        <SidebarLayout
            isOpen={isSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="장 (Chapter)"
            position="left"
            widthClass="w-80"
            desktopWidthClass="lg:w-80"
        >
            <SidebarMenu
                groups={groups}
                onItemClick={() => setIsSidebarOpen(false)}
                groupTitle="장 (Chapter)"
            />
        </SidebarLayout>
    );
};

export default Sidebar;
