import { X } from 'lucide-react';

interface CompendiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CompendiumModal = ({ isOpen, onClose }: CompendiumModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg border border-gold-border bg-[#FDFBF7] shadow-2xl dark:bg-dark-surface">
                <div className="flex items-center justify-between border-b border-gold-border/30 p-4 sm:p-6">
                    <h2 className="font-serif text-xl tracking-wide text-gold-primary sm:text-2xl">Compendium</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-2 rounded-full p-2 text-gold-primary transition-colors hover:bg-gold-surface dark:hover:bg-dark-bg"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="prose max-w-none break-keep font-noto-kr text-[15px] leading-relaxed text-[#5B7282] dark:prose-invert sm:text-base">
                        <p>
                            <strong className="text-[#1C2B36]">Yoga Sutras</strong>는 마음의 작용을 관찰하고, 집중과 자유를 향해 가는 길을 짧고 응축된 문장으로
                            기록한 텍스트입니다.
                        </p>

                        <p>
                            이 공간은 수트라 원문, 발음, 번역, 어휘, 해설을 함께 보며 한 구절을 여러 층위에서 천천히 읽기 위한 자리입니다.
                        </p>

                        <div className="rounded-r-md border-l-4 border-gold-primary bg-[#F5EFE6] p-5 dark:bg-[#222]">
                            <h3 className="mb-2 font-bold text-[#1C2B36] dark:text-gold-light">읽는 방법</h3>
                            <p className="m-0">먼저 수트라를 소리로 읽고, 여러 번역을 비교한 뒤, 해설을 참고하며 의미를 천천히 따라가 보세요.</p>
                        </div>

                        <h3 className="border-b border-gold-border/20 pb-2 text-lg font-bold text-gold-primary">네 개의 장</h3>
                        <ul className="list-disc space-y-3 pl-5 marker:text-gold-primary">
                            <li>
                                <strong className="text-[#1C2B36]">1장. 삼매의 문제</strong>
                                <br />
                                요가가 무엇이며 마음이 어떻게 고요해지는지 전체 방향을 제시합니다.
                            </li>
                            <li>
                                <strong className="text-[#1C2B36]">2장. 삼매의 단계</strong>
                                <br />
                                수행자의 태도, 훈련, 실천 구조를 구체적으로 설명합니다.
                            </li>
                            <li>
                                <strong className="text-[#1C2B36]">3장. 삼매의 성취와 결과</strong>
                                <br />
                                깊은 집중이 가져오는 변화와 그 과정에서 필요한 분별을 다룹니다.
                            </li>
                            <li>
                                <strong className="text-[#1C2B36]">4장. 해탈</strong>
                                <br />
                                궁극적인 자유와 분리, 존재의 본성을 철학적으로 탐구합니다.
                            </li>
                        </ul>

                        <h3 className="border-b border-gold-border/20 pb-2 text-lg font-bold text-gold-primary">권장 사용 흐름</h3>
                        <ul className="list-disc space-y-2 pl-5 marker:text-gold-primary">
                            <li>챕터와 구절을 선택해 읽습니다.</li>
                            <li>발음과 어휘를 따라가며 핵심 단어를 확인합니다.</li>
                            <li>여러 번역을 비교하며 강조점의 차이를 봅니다.</li>
                            <li>Commentary 패널로 구절에 대한 관점을 확장합니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompendiumModal;
