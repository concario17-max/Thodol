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
    albumCurrentTime: number;
    albumDuration: number;
    albumProgress: number;
    albumPlaybackError: string | null;
    trackEndedCount: number; // 다음 곡 자동 전환 감지용 카운터
    
    // 경전 재생 상태 메타데이터
    sutraAudioUrl: string | null;
    isSutraPlaying: boolean;
    sutraCurrentTime: number;
    sutraDuration: number;
    sutraProgress: number;
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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const albumAudioRef = useRef<HTMLAudioElement | null>(null);
    const sutraAudioRef = useRef<HTMLAudioElement | null>(null);
    const lastAlbumSeekTimeRef = useRef<number>(0);

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
    const [albumCurrentTime, setAlbumCurrentTime] = useState(0);
    const [albumDuration, setAlbumDuration] = useState(0);
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
    const [sutraCurrentTime, setSutraCurrentTime] = useState(0);
    const [sutraDuration, setSutraDuration] = useState(0);
    const [sutraPlaybackError, setSutraPlaybackError] = useState<string | null>(null);

    // 초기 오디오 객체 생성 및 이벤트 바인딩
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const albumAudio = new Audio();
        const sutraAudio = new Audio();

        albumAudioRef.current = albumAudio;
        sutraAudioRef.current = sutraAudio;

        setupAlbumEventListeners(albumAudio);
        setupSutraEventListeners(sutraAudio);

        return () => {
            albumAudio.pause();
            sutraAudio.pause();
        };
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
                setAlbumCurrentTime(audio.currentTime);
            }
        };
        audio.onloadedmetadata = () => {
            setAlbumDuration(audio.duration);
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
                        setAlbumCurrentTime(0);
                    }
                }
            }
        };
        audio.onerror = () => setAlbumPlaybackError('앨범 음원 로드 실패');
    };

    // 경전 이벤트 리스너 세팅 함수
    const setupSutraEventListeners = (audio: HTMLAudioElement) => {
        audio.ontimeupdate = () => setSutraCurrentTime(audio.currentTime);
        audio.onloadedmetadata = () => {
            setSutraDuration(audio.duration);
            setSutraPlaybackError(null);
        };
        audio.onended = () => {
            setIsSutraPlaying(false);
            setSutraCurrentTime(0);
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
        if (audio && albumDuration > 0) {
            const nextTime = Math.max(0, Math.min(percentage, 1)) * albumDuration;
            lastAlbumSeekTimeRef.current = Date.now(); // 시간 락 시동
            audio.currentTime = nextTime;
            setAlbumCurrentTime(nextTime);
        }
    }, [albumDuration]);

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
        if (audio && sutraDuration > 0) {
            const nextTime = Math.max(0, Math.min(percentage, 1)) * sutraDuration;
            audio.currentTime = nextTime;
            setSutraCurrentTime(nextTime);
        }
    }, [sutraDuration]);

    // 경전 오디오 초기화 함수
    const resetSutraAudio = useCallback(() => {
        setSutraAudioUrl(null);
        setIsSutraPlaying(false);
        setSutraCurrentTime(0);
        setSutraDuration(0);
        setSutraPlaybackError(null);
        if (sutraAudioRef.current) {
            sutraAudioRef.current.pause();
            sutraAudioRef.current.src = '';
        }
    }, []);

    const albumProgress = albumDuration > 0 ? (albumCurrentTime / albumDuration) * 100 : 0;
    const sutraProgress = sutraDuration > 0 ? (sutraCurrentTime / sutraDuration) * 100 : 0;

    return (
        <AudioContext.Provider
            value={{
                activeSession,
                currentAlbum,
                currentTrack,
                isAlbumPlaying,
                albumCurrentTime,
                albumDuration,
                albumProgress,
                albumPlaybackError,
                trackEndedCount,
                albumVolume,
                albumPlaybackRate,
                sutraAudioUrl,
                isSutraPlaying,
                sutraCurrentTime,
                sutraDuration,
                sutraProgress,
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
