import { Disc3 } from 'lucide-react';
import type { AlbumData } from '../../data/albums';

interface AlbumSelectorProps {
    albums: AlbumData[];
    selectedAlbumId: string | null;
    onSelectAlbum: (albumId: string) => void;
}

export const AlbumSelector = ({ albums, selectedAlbumId, onSelectAlbum }: AlbumSelectorProps) => (
    <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70">
                    앨범
                </p>
                <h2 className="mt-2 font-display text-2xl text-text-primary dark:text-dark-text-primary">
                    들을 음반을 고르기
                </h2>
            </div>
            <p className="max-w-[28rem] text-right text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                선택한 앨범의 표지, 설명, 트랙 목록과 재생기를 한 화면에서 확인할 수 있게 구성했다.
            </p>
        </div>

        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-gold-primary/20 md:grid md:gap-4 md:grid-cols-2 md:overflow-x-visible md:pb-0 xl:grid-cols-3">
            {albums.map((album) => {
                const isSelected = album.id === selectedAlbumId;

                return (
                    <button
                        key={album.id}
                        type="button"
                        onClick={() => onSelectAlbum(album.id)}
                        aria-pressed={isSelected}
                        className={`group flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-3 text-left transition-all duration-300 shrink-0 w-[290px] snap-start md:shrink md:w-auto ${
                            isSelected
                                ? 'border-gold-primary/35 bg-white/88 shadow-[0_18px_38px_-24px_rgba(165,139,92,0.5)] dark:border-gold-light/30 dark:bg-[#181512]/88'
                                : 'border-gold-border/14 bg-white/68 hover:-translate-y-0.5 hover:border-gold-primary/22 hover:bg-white/82 dark:border-dark-border/60 dark:bg-[#151311]/72 dark:hover:bg-[#191714]/88'
                        }`}
                    >
                        <div className="overflow-hidden rounded-[1.35rem] border border-gold-border/10 bg-gradient-to-br from-[#f5efe4] to-[#e8dcc9] shadow-sm dark:border-dark-border/45 dark:from-[#241c16] dark:to-[#17120f]">
                            <img
                                src={album.coverImage}
                                alt={`${album.title} cover`}
                                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                loading="lazy"
                            />
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col gap-3 px-1 pb-1 pt-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Disc3 className="h-4 w-4 shrink-0 text-gold-primary/70 dark:text-gold-light/70" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-primary/70 dark:text-gold-light/70">
                                        {album.artist}
                                    </span>
                                </div>
                                <h3 className="line-clamp-2 font-display text-[1.15rem] leading-tight text-text-primary dark:text-dark-text-primary">
                                    {album.title}
                                </h3>
                            </div>

                            <p className="line-clamp-3 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                                {album.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                                <span>{album.tracks.length} 트랙</span>
                                <span className={isSelected ? 'text-gold-primary dark:text-gold-light' : ''}>
                                    {isSelected ? '선택됨' : '열기'}
                                </span>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    </section>
);
