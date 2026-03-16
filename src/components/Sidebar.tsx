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
            .then((data) => {
                if (data && typeof data === 'object') {
                    setChapters(Object.values(data) as YogaChapter[]);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(parseInt(chapterNum, 10));
        }
    }, [chapterNum]);

    const toggleChapter = (chNum: number) => {
        setExpandedChapter(chNum);
        navigate(`/chapter/${chNum}/verse/1`);
    };

    const currentChapter = chapters.find((chapter) => chapter.chapter === expandedChapter);

    const groups: NavGroupType[] = chapters.map((chapter) => {
        const titleRaw = YOGA_CHAPTERS_META[chapter.chapter]?.name_korean || chapter.meta?.name_korean || '';
        const hasSubTitle = titleRaw.includes('(');
        const mainTitle = hasSubTitle ? titleRaw.substring(0, titleRaw.indexOf('(')).trim() : titleRaw;
        const subTitle = hasSubTitle ? titleRaw.substring(titleRaw.indexOf('(')).trim() : undefined;
        const isExpanded = expandedChapter === chapter.chapter;

        let items: NavItemType[] = [];
        if (isExpanded && currentChapter) {
            items = currentChapter.sutras.map((sutra, index) => {
                const sutraNumText = sutra.id.split('.')[1];
                const sutraNum = parseInt(sutraNumText, 10);
                const nextSutra = currentChapter.sutras[index + 1];

                let displaySutra = `${chapter.chapter}.${sutraNumText}`;
                if (nextSutra) {
                    const nextSutraNum = parseInt(nextSutra.id.split('.')[1], 10);
                    if (nextSutraNum > sutraNum + 1) {
                        displaySutra = `${chapter.chapter}.${sutraNum}-${nextSutraNum - 1}`;
                    }
                }

                const preview = sutra.sanskrit
                    ? `${sutra.sanskrit.split('\n')[0].substring(0, 40)}...`
                    : `Sutra ${sutraNumText}`;

                return {
                    id: String(sutraNum),
                    label: displaySutra,
                    href: `/chapter/${chapter.chapter}/verse/${sutraNumText}`,
                    description: preview,
                    isActive: chapter.chapter === parseInt(chapterNum || '1', 10) && sutraNumText === verseNum,
                };
            });
        }

        return {
            id: chapter.chapter,
            title: `${chapter.chapter}. ${mainTitle}`,
            subtitle: subTitle,
            badge: chapter.sutras.length,
            isExpanded,
            onToggle: () => toggleChapter(chapter.chapter),
            items,
        };
    });

    return (
        <SidebarLayout
            isOpen={isSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="챕터"
            position="left"
            widthClass="w-80"
            desktopWidthClass="lg:w-80"
        >
            <SidebarMenu
                groups={groups}
                onItemClick={() => setIsSidebarOpen(false)}
                groupTitle="Chapters"
            />
        </SidebarLayout>
    );
};

export default Sidebar;
