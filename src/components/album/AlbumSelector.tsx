import { Disc3 } from 'lucide-react';
import type { AlbumData } from '../../data/albums';

interface AlbumSelectorProps {
    albums: AlbumData[];
    selectedAlbumId: string | null;
    onSelectAlbum: (albumId: string) => void;
}

export const AlbumSelector = ({ albums, selectedAlbumId, onSelectAlbum }: AlbumSelectorProps) => (
    <section className="space-y-4 lg:space-y-3">
        {/* 모바일에서만 노출되는 헤더 */}
        <div className="flex items-end justify-between gap-3 lg:hidden">
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

        {/* 데스크톱에서만 노출되는 미니 헤더 */}
        <div className="hidden lg:block border-b border-gold-border/8 pb-2 dark:border-dark-border/30">
            <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-gold-primary dark:text-gold-light">
                Album Selector
            </p>
            <h3 className="mt-1 font-display text-lg text-text-primary dark:text-dark-text-primary">
                음반 목록
            </h3>
        </div>

        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-gold-primary/20 md:grid md:gap-4 md:grid-cols-2 md:overflow-x-visible md:pb-0 lg:flex lg:flex-col lg:gap-2.5 lg:pb-0 lg:overflow-y-auto lg:max-h-[68vh] xl:grid-cols-3">
            {albums.map((album) => {
                const isSelected = album.id === selectedAlbumId;

                return (
                    <button
                        key={album.id}
                        type="button"
                        onClick={() => onSelectAlbum(album.id)}
                        aria-pressed={isSelected}
                        className={`group flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-3 text-left transition-all duration-300 shrink-0 w-[290px] snap-start md:shrink md:w-auto lg:w-full lg:flex-row lg:items-center lg:gap-3 lg:p-2 lg:transition-colors ${
                            isSelected
                                ? 'border-gold-primary/35 bg-white/88 shadow-[0_18px_38px_-24px_rgba(165,139,92,0.5)] dark:border-gold-light/30 dark:bg-[#181512]/88 lg:border-y-0 lg:border-r-0 lg:border-l-[3.5px] lg:border-l-gold-primary lg:bg-gold-primary/8 lg:dark:bg-gold-light/8 lg:shadow-none lg:rounded-r-[1rem] lg:rounded-l-none lg:pl-2.5 lg:dark:border-l-gold-light'
                                : 'border-gold-border/14 bg-white/68 hover:-translate-y-0.5 hover:border-gold-primary/22 hover:bg-white/82 dark:border-dark-border/60 dark:bg-[#151311]/72 dark:hover:bg-[#191714]/88 lg:border-none lg:bg-transparent lg:shadow-none lg:hover:bg-black/4 lg:dark:hover:bg-white/4 lg:rounded-[1rem] lg:hover:-translate-y-0'
                        }`}
                    >
                        <div className="overflow-hidden rounded-[1.35rem] border border-gold-border/10 bg-gradient-to-br from-[#f5efe4] to-[#e8dcc9] shadow-sm dark:border-dark-border/45 dark:from-[#241c16] dark:to-[#17120f] shrink-0 lg:h-14 lg:w-14 lg:rounded-[1rem]">
                            <img
                                src={album.coverImage}
                                alt={`${album.title} cover`}
                                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] lg:aspect-square lg:h-full lg:w-full"
                                loading="lazy"
                            />
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col gap-3 px-1 pb-1 pt-4 lg:pt-0 lg:px-0 lg:pb-0 lg:gap-1 lg:justify-center">
                            <div className="space-y-1 lg:space-y-0.5">
                                <div className="flex items-center gap-2 lg:hidden">
                                    <Disc3 className="h-4 w-4 shrink-0 text-gold-primary/70 dark:text-gold-light/70" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-primary/70 dark:text-gold-light/70">
                                        {album.artist}
                                    </span>
                                </div>
                                <h3 className="line-clamp-2 font-display text-[1.15rem] leading-tight text-text-primary dark:text-dark-text-primary lg:font-sans lg:text-[13px] lg:font-semibold lg:line-clamp-1 lg:leading-snug">
                                    {album.title}
                                </h3>
                                <p className="hidden lg:block text-[10px] text-text-secondary/80 dark:text-dark-text-secondary/70">
                                    {album.artist}
                                </p>
                            </div>

                            <p className="line-clamp-3 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary lg:hidden">
                                {album.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary/70 dark:text-dark-text-secondary/70 lg:hidden">
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
