import { X } from 'lucide-react';

interface CompendiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CompendiumModal = ({ isOpen, onClose }: CompendiumModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-dark-surface border border-gold-border rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold-border/30">
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-primary tracking-wide">
                        Compendium
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gold-primary hover:bg-gold-surface dark:hover:bg-dark-bg rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    <div className="prose prose-[#5B7282] dark:prose-invert max-w-none font-noto-kr text-[15px] sm:text-base leading-relaxed break-keep">

                        <p className="mb-6">
                            요가수트라. 단순 명상 교과서 아님. 이 텍스트는 직역 그대로 <strong className="font-bold text-[#1C2B36]">‘요가의 실천적 아포리즘’</strong>. ‘요가(Yoga)’는 <strong className="font-bold text-[#1C2B36]">마음 작용의 지멸</strong>, ‘수트라(Sutra)’는 <strong className="font-bold text-[#1C2B36]">실(Thread)</strong>.
                        </p>

                        <p className="mb-6">
                            단순 “경전 문장” 이전에 <strong className="font-bold text-[#1C2B36]">존재의 실오라기</strong>. 삶 전체를 관통하는 명확한 구조의 꿰어짐이 문제됨.
                        </p>

                        <div className="bg-[#F5EFE6] dark:bg-[#222] border-l-4 border-gold-primary p-5 my-8 rounded-r-md">
                            <h3 className="font-bold text-[#1C2B36] dark:text-gold-light mb-2">실오라기에 연결된 ‘구조’의 정체</h3>
                            <p className="text-[#5B7282] m-0">
                                단순 문장 해석 거부. 내재된 <strong className="font-bold text-[#1C2B36]">마음의 층위와 지멸의 구조</strong> 탐구 지향. 수트라 간 연결의 “구조적 파악”이 요가수트라 학습의 본질.
                            </p>
                        </div>

                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">4장 전체. 단일한 ‘해방 지도’</h3>
                        <p className="mb-4">
                            1장부터 4장의 파편화 거부. 전체를 <strong className="font-bold text-[#1C2B36]">인간이 마음을 해체해 영존(Kaivalya)으로 직진하는 시스템적 프로세스</strong>로 해석 제안.
                        </p>
                        <ul className="list-disc pl-5 space-y-3 mb-6 text-[#5B7282] marker:text-gold-primary">
                            <li><strong className="text-[#1C2B36]">1장 (사마디 파다): 목적과 본질</strong><br />요가의 초월적 몰입 상태의 해부. 최상위 목표 제시.</li>
                            <li><strong className="text-[#1C2B36]">2장 (사다나 파다): 실천과 수련</strong><br /><strong className="text-[#1C2B36]">8단계 병렬 구조(아쉬탕가)</strong>. 번뇌 제거를 위한 구체적 방법론.</li>
                            <li><strong className="text-[#1C2B36]">3장 (비부티 파다): 초월적 결과</strong><br />수련의 깊이에 따른 내적 집중(삼야마)이 유발하는 경이로운 권능.</li>
                            <li><strong className="text-[#1C2B36]">4장 (카이발리야 파다): 절대 독존</strong><br />마음의 소멸. <strong className="text-[#1C2B36]">영적 관찰자로서의 자각</strong>. 자연(프라크리티)으로부터의 완전한 분리.</li>
                        </ul>
                        <p className="text-[14px] opacity-80 italic mb-8">
                            (특정 종교적 교리 아님. 텍스트 흐름 추적을 위한 심리 알고리즘적 <strong className="font-bold">해체 지침</strong>.)
                        </p>

                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">핵심. ‘체험 주체’의 강제 전환</h3>
                        <p className="mb-4">
                            외부 요인 아님. 두 인식 주체의 치명적 융합 오류.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-[#5B7282] marker:text-gold-primary">
                            <li>푸루샤 (순수 관찰자/의식)</li>
                            <li>프라크리티 (마음이 투영된 모든 물질계 반응 현상)</li>
                        </ul>
                        <p className="mb-4">의문 발생.</p>
                        <blockquote className="border-l-4 border-gold-primary/50 pl-4 py-1 my-4 italic text-[#1C2B36]">
                            "왜 고통(클레샤)과 번뇌가 끝나지 않는가?"
                        </blockquote>
                        <p className="mb-8">
                            원인 분석. <strong className="font-bold text-[#1C2B36]">‘의식 주체’ 오지정 (아비디야)</strong>.<br />
                            육체/정신의 데이터가 "존재 핵(푸루샤)"과 융합되었다는 착각. 요가수트라 실천의 핵심은 환영을 걷어내는 지속적 분리 훈련 구동.
                        </p>

                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">압축 경전 아님. 마이크로 실천 매뉴얼</h3>
                        <p className="mb-4">
                            추상적 요약본 거부. 삶의 다중 국면에서 발생되는 체험에 대한 <strong className="font-bold text-[#1C2B36]">초정밀 가이드라인</strong> 제공.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-6 text-[#5B7282] marker:text-gold-primary">
                            <li>각 단계별 발생 체험 특정</li>
                            <li>해당 체험의 심층 의미 디코딩</li>
                            <li>신/진리 기준의 행동 지침 즉각 하달</li>
                        </ul>
                        <p className="mb-8">
                            단순 관념론 아님. <strong className="font-bold text-[#1C2B36]">일상 체험 돌파용 실무 지침서</strong>.
                        </p>

                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">배경 설계: 샹캬 철학 베이스 디코딩</h3>
                        <p className="mb-4">
                            샹캬 철학 개념의 반복 등장. 푸루샤(Puruṣa), 프라크리티(Prakṛti), 삼구나(sattva/rajas/tamas). 단순 배경 지식 아님. 텍스트 <strong className="font-bold text-[#1C2B36]">정밀 해독을 위한 마스터 키</strong>.
                        </p>
                        <p className="mb-8">
                            단순 암기 거부. 반복 노출로 각인되는 <strong className="font-bold text-[#1C2B36]">실감(진동감각)</strong> 최우선. 개념 너머의 실체적 이해 도달 목표.
                        </p>

                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">특수 문헌 아님. 보편 알고리즘</h3>
                        <p className="mb-8">
                            소수 엘리트용 비밀 문서 아님. 시대를 관통하며 검증된 <strong className="font-bold text-[#1C2B36]">보편 경전</strong>. 계층 무관, 삶의 현장에서 지속적 변환 및 적용 가능. <strong className="font-bold text-[#1C2B36]">자연스럽고 필수적인 생존 지식</strong>.
                        </p>

                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">학습 아키텍처</h3>
                        <p className="mb-4">
                            단순 독해 거절. 각 장을 <strong className="font-bold text-[#1C2B36]">체험 매핑 영역</strong>으로 배치. 텍스트 로직의 즉각적 실존 적용 가이드.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-8 text-[#5B7282] marker:text-gold-primary">
                            <li><strong className="text-[#1C2B36]">구조 파악:</strong> 각 4파다 전체 흐름 논리적 구조화</li>
                            <li><strong className="text-[#1C2B36]">단계적 해킹:</strong> 야마-니야마부터 사마디까지의 시스템 해킹 병렬 연결</li>
                            <li><strong className="text-[#1C2B36]">관점 정렬:</strong> 진리 기반 선택 알고리즘 강제</li>
                            <li><strong className="text-[#1C2B36]">실행:</strong> "인지"를 "절대적 통과"로 변환</li>
                        </ul>

                        <div className="bg-gold-surface/30 dark:bg-[#1a1a1a] p-6 rounded-lg text-center mt-12 mb-4">
                            <p className="mb-2">본질. 극도로 단순함.</p>
                            <h4 className="text-xl font-bold text-gold-primary mb-4">관점 확립. 그 후는 단순 반복 실행.</h4>
                            <p className="italic opacity-80">관점 셋업을 위한 최적화 환경 지향.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompendiumModal;
