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
            <div className="relative flex max-h-[90vh] w-full max-w-[52rem] flex-col overflow-hidden rounded-[1.75rem] border border-gold-border/45 bg-[#FDFBF7] shadow-[0_32px_80px_-28px_rgba(0,0,0,0.5)] dark:bg-dark-surface">
                <div className="flex items-center justify-between border-b border-gold-border/20 px-5 py-4 sm:px-6 sm:py-5">
                    <h2 className="font-display text-[1.25rem] tracking-[0.08em] text-gold-primary sm:text-[1.5rem]">Compendium</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-1 rounded-full p-2 text-gold-primary transition-colors hover:bg-gold-surface dark:hover:bg-dark-bg"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                    <div className="prose max-w-none break-keep font-noto-kr text-[15px] leading-relaxed text-[#5B7282] dark:prose-invert sm:text-base">
                        <p>
                            <strong className="text-[#1C2B36]">Yoga Sutras</strong>는 마음의 작용을 관찰하고 집중과 자유로 향하는 길을
                            짧은 문장으로 기록한 고전 텍스트입니다.
                        </p>

                        <p>
                            이 공간은 산스크리트 원문, 발음, 번역, 어휘, 오디오, 그리고 commentary를 함께 보며 한 구절을 여러 층위에서
                            천천히 읽기 위한 읽기 환경입니다.
                        </p>

                        <div className="rounded-r-md border-l-4 border-gold-primary bg-[#F5EFE6] p-5 dark:bg-[#222]">
                            <h3 className="mb-2 font-bold text-[#1C2B36] dark:text-gold-light">읽는 방법</h3>
                            <p className="m-0">
                                먼저 원문과 발음을 소리로 따라가고, 여러 번역을 비교한 뒤 commentary에서 맥락과 질문을 확인해 보세요.
                            </p>
                        </div>

                        <h3 className="border-b border-gold-border/20 pb-2 text-lg font-bold text-gold-primary">네 개의 장</h3>
                        <ul className="list-disc space-y-3 pl-5 marker:text-gold-primary">
                            <li>
                                <strong className="text-[#1C2B36]">1장. 합일의 문제</strong>
                                <br />
                                요가가 무엇이고 마음을 어떻게 고요하게 하는지, 수행의 전체 방향을 제시합니다.
                            </li>
                            <li>
                                <strong className="text-[#1C2B36]">2장. 합일의 단계</strong>
                                <br />
                                수행자의 태도, 훈련, 실천 구조를 구체적으로 설명합니다.
                            </li>
                            <li>
                                <strong className="text-[#1C2B36]">3장. 합일의 성취와 그 결과</strong>
                                <br />
                                깊은 집중이 가져오는 변화와 그 과정에서 필요한 분별을 다룹니다.
                            </li>
                            <li>
                                <strong className="text-[#1C2B36]">4장. 깨달음</strong>
                                <br />
                                궁극적인 자유와 분리, 존재의 본성을 철학적으로 탐구합니다.
                            </li>
                        </ul>

                        <h3 className="border-b border-gold-border/20 pb-2 text-lg font-bold text-gold-primary">권장 사용 흐름</h3>
                        <ul className="list-disc space-y-2 pl-5 marker:text-gold-primary">
                            <li>챕터와 구절을 선택해 읽기를 시작합니다.</li>
                            <li>발음과 오디오를 따라가며 리듬과 호흡을 먼저 익힙니다.</li>
                            <li>여러 번역을 비교하며 핵심 어휘의 차이를 확인합니다.</li>
                            <li>Commentary 패널에서 핵심 요약과 사유 질문을 함께 읽습니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompendiumModal;
