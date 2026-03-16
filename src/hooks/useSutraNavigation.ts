import { useNavigate } from 'react-router-dom';
import { YogaChapter } from '../types';

export const useSutraNavigation = (
  allChapters: Record<number, YogaChapter> | null,
  chapterNum: string | undefined,
  currentIndex: number
) => {
  const navigate = useNavigate();

  const handlePrev = () => {
    if (!allChapters || !chapterNum) return;
    const currentC = parseInt(chapterNum, 10);
    const currentChapter = allChapters[currentC];

    if (currentIndex > 0) {
      navigate(`/chapter/${currentC}/verse/${currentChapter.sutras[currentIndex - 1].id.split('.')[1]}`);
    } else if (currentC > 1) {
      const prevChapter = allChapters[currentC - 1];
      if (prevChapter?.sutras.length) {
        navigate(`/chapter/${currentC - 1}/verse/${prevChapter.sutras[prevChapter.sutras.length - 1].id.split('.')[1]}`);
      }
    }
  };

  const handleNext = () => {
    if (!allChapters || !chapterNum) return;
    const currentC = parseInt(chapterNum, 10);
    const currentChapter = allChapters[currentC];

    if (currentIndex < currentChapter.sutras.length - 1) {
      navigate(`/chapter/${currentC}/verse/${currentChapter.sutras[currentIndex + 1].id.split('.')[1]}`);
    } else if (currentC < Object.keys(allChapters).length) {
      const nextChapter = allChapters[currentC + 1];
      if (nextChapter?.sutras.length) {
        navigate(`/chapter/${currentC + 1}/verse/${nextChapter.sutras[0].id.split('.')[1]}`);
      }
    }
  };

  return { handlePrev, handleNext };
};
