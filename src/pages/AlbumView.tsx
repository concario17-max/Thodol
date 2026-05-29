import { useEffect, useMemo, useState } from 'react';
import { LibraryBig, Loader2 } from 'lucide-react';
import { AlbumSelector } from '../components/album/AlbumSelector';
import { AlbumDetail } from '../components/album/AlbumDetail';
import { ALBUMS_ROUTE_PATH, loadAlbums, type AlbumData } from '../data/albums';
import { useUI } from '../context/UIContext';

const loadingState = (
    <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-gold-primary dark:text-gold-light" />
    </div>
);

const errorState = (message: string) => (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 text-center">
        <div className="rounded-[2rem] border border-gold-border/14 bg-white/72 px-6 py-7 shadow-[0_18px_40px_-34px_rgba(0,0,0,0.4)] dark:border-dark-border/55 dark:bg-[#111]/55">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">앨범 안내</p>
            <h1 className="mt-3 font-display text-2xl text-text-primary dark:text-dark-text-primary">앨범 데이터를 불러오지 못했어</h1>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">{message}</p>
        </div>
    </div>
);

const AlbumView = () => {
    const { lastNonAlbumVerseContentMode, setActiveVerseContentMode } = useUI();
    const [albums, setAlbums] = useState<AlbumData[]>([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setActiveVerseContentMode('album');
        return () => {
            setActiveVerseContentMode(lastNonAlbumVerseContentMode);
        };
    }, [lastNonAlbumVerseContentMode, setActiveVerseContentMode]);

    useEffect(() => {
        let active = true;

        const run = async () => {
            try {
                setLoading(true);
                const nextAlbums = await loadAlbums();

                if (!active) {
                    return;
                }

                setAlbums(nextAlbums);
                setSelectedAlbumId((current) => current ?? nextAlbums[0]?.id ?? null);
                setError(null);
            } catch (loadError) {
                if (!active) {
                    return;
                }

                setError(loadError instanceof Error ? loadError.message : '알 수 없는 오류가 발생했어.');
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void run();

        return () => {
            active = false;
        };
    }, []);

    const selectedAlbum = useMemo(
        () => albums.find((album) => album.id === selectedAlbumId) ?? albums[0] ?? null,
        [albums, selectedAlbumId],
    );

    useEffect(() => {
        if (!selectedAlbum) {
            setSelectedTrackId(null);
            return;
        }

        setSelectedTrackId((current) => {
            const stillExists = selectedAlbum.tracks.some((track) => track.id === current);
            return stillExists ? current : selectedAlbum.tracks[0]?.id ?? null;
        });
    }, [selectedAlbum]);

    if (loading) {
        return loadingState;
    }

    if (error) {
        return errorState(error);
    }

    if (!selectedAlbum) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                앨범이 없어. `public/albums.json`을 확인해야 해.
            </div>
        );
    }

    return (
        <div className="relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,248,235,0.88)_0%,rgba(255,248,235,0.18)_32%,transparent_68%),linear-gradient(180deg,rgba(252,248,239,0.96)_0%,rgba(247,241,230,0.94)_100%)] text-text-primary transition-colors duration-500 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_32%,transparent_68%),linear-gradient(180deg,rgba(15,13,12,0.96)_0%,rgba(11,10,9,0.98)_100%)] dark:text-dark-text-primary">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(165,139,92,0.06)_0%,transparent_30%,transparent_70%,rgba(165,139,92,0.05)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_30%,transparent_70%,rgba(255,255,255,0.02)_100%)]" />

            <div className="relative mx-auto flex min-h-full w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <header className="rounded-[2.2rem] border border-gold-border/12 bg-white/64 px-5 py-5 shadow-[0_22px_48px_-38px_rgba(0,0,0,0.4)] backdrop-blur-xl dark:border-dark-border/55 dark:bg-[#111]/52 sm:px-6 sm:py-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/75 dark:text-gold-light/75">
                                <LibraryBig className="h-4 w-4" />
                                {ALBUMS_ROUTE_PATH}
                            </p>
                            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.03] text-text-primary dark:text-dark-text-primary">
                                앨범 듣기
                            </h1>
                            <p className="mt-4 max-w-3xl text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary sm:text-[16px]">
                                앨범을 선택하고 트랙을 골라 바로 재생하는 화면이야. 작업 메모 없이도 이 페이지에서 앨범 전체를
                                살펴볼 수 있게 구성했다.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                            <span className="rounded-full border border-gold-border/12 bg-white/72 px-3 py-2 dark:border-dark-border/45 dark:bg-white/5">
                                {albums.length}개 앨범
                            </span>
                            <span className="rounded-full border border-gold-border/12 bg-white/72 px-3 py-2 dark:border-dark-border/45 dark:bg-white/5">
                                첫 앨범 기본 선택
                            </span>
                        </div>
                    </div>
                </header>

                <main className="space-y-6">
                    <AlbumSelector albums={albums} selectedAlbumId={selectedAlbum.id} onSelectAlbum={(albumId) => setSelectedAlbumId(albumId)} />

                    <AlbumDetail album={selectedAlbum} selectedTrackId={selectedTrackId} onSelectTrack={(trackId) => setSelectedTrackId(trackId)} />
                </main>
            </div>
        </div>
    );
};

export default AlbumView;
