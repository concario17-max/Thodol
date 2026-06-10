import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { AlbumData, AlbumTrack } from '../data/albums';

// 활성 오디오 세션 타입 정의
export type AudioSessionType = 'sutra' | 'album' | null;

interface AudioContextType {
    activeSession: AudioSessionType;
    // 앨범 재생 상태 메타데이터
    currentAlbum: AlbumData | null;
    currentTrack: AlbumTrack | null;
    isAlbumPlaying: boolean;
    albumPlaybackError: string | null;
    trackEndedCount: number; // 다음 곡 자동 전환 감지용 카운터
    
    // 경전 재생 상태 메타데이터
    sutraAudioUrl: string | null;
    isSutraPlaying: boolean;
    sutraPlaybackError: string | null;

    albumVolume: number;
    albumPlaybackRate: number;

    // 앨범 관련 액션
    playAlbumTrack: (album: AlbumData, track: AlbumTrack) => Promise<void>;
    pauseAlbumTrack: () => void;
    toggleAlbumPlay: () => Promise<void>;
    seekAlbum: (percentage: number) => void;
    setAlbumVolume: (vol: number) => void;
    setAlbumPlaybackRate: (rate: number) => void;
    
    // 경전 관련 액션
    playSutraAudio: (url: string) => Promise<void>;
    pauseSutraAudio: () => void;
    toggleSutraPlay: () => Promise<void>;
    seekSutra: (percentage: number) => void;
    resetSutraAudio: () => void;

    // 시간 및 프로그레스 이벤트 구독 인터페이스
    registerAlbumTimeListener: (listener: (time: number, duration: number, progress: number) => void) => () => void;
    registerSutraTimeListener: (listener: (time: number, duration: number, progress: number) => void) => () => void;
    getAudioTime: (session: 'album' | 'sutra') => { currentTime: number; duration: number; progress: number };
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const albumAudioRef = useRef<HTMLAudioElement | null>(null);
    const sutraAudioRef = useRef<HTMLAudioElement | null>(null);
    const lastAlbumSeekTimeRef = useRef<number>(0);

    // 고빈도 갱신 시간을 전달하기 위한 리스너 세트
    const albumTimeListenersRef = useRef<Set<(time: number, duration: number, progress: number) => void>>(new Set());
    const sutraTimeListenersRef = useRef<Set<(time: number, duration: number, progress: number) => void>>(new Set());

    // 최신 오디오 상태를 stale closure 없이 관리하기 위한 Refs
    const currentAlbumRef = useRef<AlbumData | null>(null);
    const currentTrackRef = useRef<AlbumTrack | null>(null);
    const playAlbumTrackRef = useRef<((album: AlbumData, track: AlbumTrack) => Promise<void>) | null>(null);

    // 활성 세션 상태
    const [activeSession, setActiveSession] = useState<AudioSessionType>(null);
    
    // 앨범 재생 상태
    const [currentAlbum, setCurrentAlbum] = useState<AlbumData | null>(null);
    const [currentTrack, setCurrentTrack] = useState<AlbumTrack | null>(null);
    const [isAlbumPlaying, setIsAlbumPlaying] = useState(false);
    const [albumPlaybackError, setAlbumPlaybackError] = useState<string | null>(null);
    const [trackEndedCount, setTrackEndedCount] = useState(0);

    // 최신 상태 Refs 동기화
    useEffect(() => {
        currentAlbumRef.current = currentAlbum;
    }, [currentAlbum]);

    useEffect(() => {
        currentTrackRef.current = currentTrack;
    }, [currentTrack]);
    const [albumVolume, setAlbumVolumeState] = useState(1.0);
    const [albumPlaybackRate, setAlbumPlaybackRateState] = useState(1.0);

    // 경전 재생 상태
    const [sutraAudioUrl, setSutraAudioUrl] = useState<string | null>(null);
    const [isSutraPlaying, setIsSutraPlaying] = useState(false);
    const [sutraPlaybackError, setSutraPlaybackError] = useState<string | null>(null);

    // 초기 오디오 객체 생성 및 이벤트 바인딩
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const albumAudio = new Audio();
        albumAudio.preload = 'none'; // 모바일 데이터 소모 방지를 위한 프리로드 제한
        
        const sutraAudio = new Audio();
        sutraAudio.preload = 'none';

        albumAudioRef.current = albumAudio;
        sutraAudioRef.current = sutraAudio;

        setupAlbumEventListeners(albumAudio);
        setupSutraEventListeners(sutraAudio);

        return () => {
            albumAudio.pause();
            sutraAudio.pause();
        };
    }, []);


    // 앨범 시간 업데이트 이벤트 전파
    const triggerAlbumTimeUpdate = useCallback(() => {
        const audio = albumAudioRef.current;
        if (!audio) return;
        const time = audio.currentTime;
        const duration = audio.duration || 0;
        const progress = duration > 0 ? (time / duration) * 100 : 0;
        albumTimeListenersRef.current.forEach((fn) => fn(time, duration, progress));
    }, []);

    // 경전 시간 업데이트 이벤트 전파
    const triggerSutraTimeUpdate = useCallback(() => {
        const audio = sutraAudioRef.current;
        if (!audio) return;
        const time = audio.currentTime;
        const duration = audio.duration || 0;
        const progress = duration > 0 ? (time / duration) * 100 : 0;
        sutraTimeListenersRef.current.forEach((fn) => fn(time, duration, progress));
    }, []);

    // 앨범 이벤트 리스너 세팅 함수
    const setupAlbumEventListeners = (audio: HTMLAudioElement) => {
        audio.ontimeupdate = () => {
            const now = Date.now();
            // 최근 500ms 이내에 탐색이 일어났으면 브라우저의 낡은 타임 업데이트 프레임을 무시함
            if (now - lastAlbumSeekTimeRef.current < 500) {
                return;
            }
            if (!audio.seeking) {
                triggerAlbumTimeUpdate();
            }
        };
        audio.onloadedmetadata = () => {
            triggerAlbumTimeUpdate();
            setAlbumPlaybackError(null);
        };
        audio.onended = () => {
            setIsAlbumPlaying(false);
            setTrackEndedCount((prev) => prev + 1);

            // 전역 다음 트랙 자동 재생 연쇄 처리
            const album = currentAlbumRef.current;
            const track = currentTrackRef.current;
            const playFn = playAlbumTrackRef.current;

            if (album && track && playFn) {
                const tracks = album.tracks;
                const currentIndex = tracks.findIndex((t) => t.id === track.id);
                if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
                    const nextTrack = tracks[currentIndex + 1];
                    void playFn(album, nextTrack);
                } else if (currentIndex === tracks.length - 1) {
                    const firstTrack = tracks[0];
                    if (firstTrack) {
                        setCurrentTrack(firstTrack);
                        audio.src = firstTrack.url;
                        audio.load();
                        triggerAlbumTimeUpdate();
                    }
                }
            }
        };
        audio.onerror = () => setAlbumPlaybackError('앨범 음원 로드 실패');
    };

    // 경전 이벤트 리스너 세팅 함수
    const setupSutraEventListeners = (audio: HTMLAudioElement) => {
        audio.ontimeupdate = () => triggerSutraTimeUpdate();
        audio.onloadedmetadata = () => {
            triggerSutraTimeUpdate();
            setSutraPlaybackError(null);
        };
        audio.onended = () => {
            setIsSutraPlaying(false);
            triggerSutraTimeUpdate();
        };
        audio.onerror = () => setSutraPlaybackError('경전 음원 로드 실패');
    };

    // 앨범 트랙 변경 및 재생 함수
    const playAlbumTrack = useCallback(async (album: AlbumData, track: AlbumTrack) => {
        const audio = albumAudioRef.current;
        if (!audio) return;

        // 경전 세션 일시정지 조율
        if (sutraAudioRef.current && isSutraPlaying) {
            sutraAudioRef.current.pause();
            setIsSutraPlaying(false);
        }

        setActiveSession('album');
        
        // 트랙이 새로 지정된 경우에만 로드
        if (currentTrack?.id !== track.id) {
            setCurrentAlbum(album);
            setCurrentTrack(track);
            audio.src = track.url;
            audio.load();
            audio.playbackRate = albumPlaybackRate; // 기존 설정된 배속 반영
            audio.volume = albumVolume; // 기존 설정된 볼륨 반영
        }

        try {
            await audio.play();
            setIsAlbumPlaying(true);
            setAlbumPlaybackError(null);
        } catch {
            setAlbumPlaybackError('재생 시작 실패');
            setIsAlbumPlaying(false);
        }
    }, [currentTrack, isSutraPlaying]);

    // 재생 함수 최신화 Ref
    useEffect(() => {
        playAlbumTrackRef.current = playAlbumTrack;
    }, [playAlbumTrack]);

    // 앨범 일시정지 함수
    const pauseAlbumTrack = useCallback(() => {
        if (albumAudioRef.current) {
            albumAudioRef.current.pause();
            setIsAlbumPlaying(false);
        }
    }, []);

    // 앨범 재생 토글 함수
    const toggleAlbumPlay = useCallback(async () => {
        if (!currentTrack || !currentAlbum) return;
        if (isAlbumPlaying) {
            pauseAlbumTrack();
        } else {
            await playAlbumTrack(currentAlbum, currentTrack);
        }
    }, [currentAlbum, currentTrack, isAlbumPlaying, playAlbumTrack, pauseAlbumTrack]);

    // 앨범 볼륨 조절 함수
    const setAlbumVolume = useCallback((vol: number) => {
        const audio = albumAudioRef.current;
        if (audio) {
            const clamped = Math.max(0, Math.min(vol, 1));
            audio.volume = clamped;
            setAlbumVolumeState(clamped);
        }
    }, []);

    // 앨범 배속 조절 함수
    const setAlbumPlaybackRate = useCallback((rate: number) => {
        const audio = albumAudioRef.current;
        if (audio) {
            audio.playbackRate = rate;
            setAlbumPlaybackRateState(rate);
        }
    }, []);

    // 앨범 탐색(Seek) 함수
    const seekAlbum = useCallback((percentage: number) => {
        const audio = albumAudioRef.current;
        if (audio) {
            const duration = audio.duration || 0;
            if (duration > 0) {
                const nextTime = Math.max(0, Math.min(percentage, 1)) * duration;
                lastAlbumSeekTimeRef.current = Date.now(); // 시간 락 시동
                audio.currentTime = nextTime;
                triggerAlbumTimeUpdate();
            }
        }
    }, [triggerAlbumTimeUpdate]);

    // 경전 재생 함수
    const playSutraAudio = useCallback(async (url: string) => {
        const audio = sutraAudioRef.current;
        if (!audio) return;

        // 앨범 세션 일시정지 조율
        if (albumAudioRef.current && isAlbumPlaying) {
            albumAudioRef.current.pause();
            setIsAlbumPlaying(false);
        }

        setActiveSession('sutra');

        if (sutraAudioUrl !== url) {
            setSutraAudioUrl(url);
            audio.src = url;
            audio.load();
        }

        try {
            await audio.play();
            setIsSutraPlaying(true);
            setSutraPlaybackError(null);
        } catch {
            setSutraPlaybackError('경전 재생 시작 실패');
            setIsSutraPlaying(false);
        }
    }, [sutraAudioUrl, isAlbumPlaying]);

    // 경전 일시정지 함수
    const pauseSutraAudio = useCallback(() => {
        if (sutraAudioRef.current) {
            sutraAudioRef.current.pause();
            setIsSutraPlaying(false);
        }
    }, []);

    // 경전 재생 토글 함수
    const toggleSutraPlay = useCallback(async () => {
        if (!sutraAudioUrl) return;
        if (isSutraPlaying) {
            pauseSutraAudio();
        } else {
            await playSutraAudio(sutraAudioUrl);
        }
    }, [sutraAudioUrl, isSutraPlaying, playSutraAudio, pauseSutraAudio]);

    // 경전 탐색 함수
    const seekSutra = useCallback((percentage: number) => {
        const audio = sutraAudioRef.current;
        if (audio) {
            const duration = audio.duration || 0;
            if (duration > 0) {
                const nextTime = Math.max(0, Math.min(percentage, 1)) * duration;
                audio.currentTime = nextTime;
                triggerSutraTimeUpdate();
            }
        }
    }, [triggerSutraTimeUpdate]);

    // 경전 오디오 초기화 함수
    const resetSutraAudio = useCallback(() => {
        setSutraAudioUrl(null);
        setIsSutraPlaying(false);
        if (sutraAudioRef.current) {
            sutraAudioRef.current.pause();
            sutraAudioRef.current.src = '';
        }
        // 시간 상태 리셋 전파
        sutraTimeListenersRef.current.forEach((fn) => fn(0, 0, 0));
        setSutraPlaybackError(null);
    }, []);

    // 리스너 등록 액션 구현
    const registerAlbumTimeListener = useCallback((listener: (time: number, duration: number, progress: number) => void) => {
        albumTimeListenersRef.current.add(listener);
        return () => {
            albumTimeListenersRef.current.delete(listener);
        };
    }, []);

    const registerSutraTimeListener = useCallback((listener: (time: number, duration: number, progress: number) => void) => {
        sutraTimeListenersRef.current.add(listener);
        return () => {
            sutraTimeListenersRef.current.delete(listener);
        };
    }, []);

    // 오디오 현재 시간 즉시 조회를 위한 헬퍼
    const getAudioTime = useCallback((session: 'album' | 'sutra') => {
        if (session === 'album') {
            const audio = albumAudioRef.current;
            if (!audio) return { currentTime: 0, duration: 0, progress: 0 };
            const time = audio.currentTime;
            const duration = audio.duration || 0;
            const progress = duration > 0 ? (time / duration) * 100 : 0;
            return { currentTime: time, duration, progress };
        } else {
            const audio = sutraAudioRef.current;
            if (!audio) return { currentTime: 0, duration: 0, progress: 0 };
            const time = audio.currentTime;
            const duration = audio.duration || 0;
            const progress = duration > 0 ? (time / duration) * 100 : 0;
            return { currentTime: time, duration, progress };
        }
    }, []);

    return (
        <AudioContext.Provider
            value={{
                activeSession,
                currentAlbum,
                currentTrack,
                isAlbumPlaying,
                albumPlaybackError,
                trackEndedCount,
                albumVolume,
                albumPlaybackRate,
                sutraAudioUrl,
                isSutraPlaying,
                sutraPlaybackError,
                playAlbumTrack,
                pauseAlbumTrack,
                toggleAlbumPlay,
                seekAlbum,
                setAlbumVolume,
                setAlbumPlaybackRate,
                playSutraAudio,
                pauseSutraAudio,
                toggleSutraPlay,
                seekSutra,
                resetSutraAudio,
                registerAlbumTimeListener,
                registerSutraTimeListener,
                getAudioTime,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useGlobalAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useGlobalAudio는 AudioProvider 하위에서 호출되어야 해');
    }
    return context;
};

// 시간/프로그레스 개별 구독을 위한 고성능 커스텀 훅
export const useAudioTime = (session: 'album' | 'sutra') => {
    const context = useGlobalAudio();
    const [timeInfo, setTimeInfo] = useState({ currentTime: 0, duration: 0, progress: 0 });

    useEffect(() => {
        // 컴포넌트 마운트 시 초기값 세팅
        setTimeInfo(context.getAudioTime(session));

        const register = session === 'album' 
            ? context.registerAlbumTimeListener 
            : context.registerSutraTimeListener;

        const unsubscribe = register((time, duration, progress) => {
            setTimeInfo({ currentTime: time, duration, progress });
        });

        return unsubscribe;
    }, [session, context]);

    return timeInfo;
};
