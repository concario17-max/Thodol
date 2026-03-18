import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { YOGA_CHAPTERS_META } from '../constants';
import { useUI } from '../context/UIContext';
import { useYogaData } from '../hooks/useYogaData';
import { SidebarLayout } from './ui/SidebarLayout';
import { NavGroupType, NavItemType, SidebarMenu } from './ui/SidebarMenu';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const { chapters } = useYogaData();
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(parseInt(chapterNum, 10));
        }
    }, [chapterNum]);

    const toggleChapter = (chapter: number) => {
        setExpandedChapter(chapter);
        navigate(`/chapter/${chapter}/verse/1`);
    };

    const currentExpandedChapter = chapters.find((chapter) => chapter.chapter === expandedChapter);

    const groups: NavGroupType[] = chapters.map((chapter) => {
        const titleRaw = YOGA_CHAPTERS_META[chapter.chapter]?.name_korean || chapter.meta.name_korean;
        const isExpanded = expandedChapter === chapter.chapter;
        const items: NavItemType[] =
            isExpanded && currentExpandedChapter
                ? currentExpandedChapter.sutras.map((sutra, index) => {
                      const sutraNumberText = sutra.id.split('.')[1];
                      const sutraNumber = parseInt(sutraNumberText, 10);
                      const nextSutra = currentExpandedChapter.sutras[index + 1];
                      const displayLabel =
                          nextSutra && parseInt(nextSutra.id.split('.')[1], 10) > sutraNumber + 1
                              ? `${chapter.chapter}.${sutraNumber}-${parseInt(nextSutra.id.split('.')[1], 10) - 1}`
                              : `${chapter.chapter}.${sutraNumberText}`;

                      return {
                          id: sutra.id,
                          label: displayLabel,
                          href: `/chapter/${chapter.chapter}/verse/${sutraNumberText}`,
                          description: sutra.sanskrit ? `${sutra.sanskrit.split('\n')[0].slice(0, 40)}...` : `Sutra ${sutraNumberText}`,
                          isActive: chapter.chapter === parseInt(chapterNum || '1', 10) && sutraNumberText === verseNum,
                      };
                  })
                : [];

        return {
            id: chapter.chapter,
            title: `${chapter.chapter}. ${titleRaw}`,
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
            widthClass="w-[88vw] max-w-[360px]"
            desktopWidthClass="lg:w-[400px]"
        >
            <SidebarMenu groups={groups} onItemClick={() => setIsSidebarOpen(false)} groupTitle="Chapters" />
        </SidebarLayout>
    );
};

export default Sidebar;
