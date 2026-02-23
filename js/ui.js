// --- UI 렌더링 로직 ---

import { initAudioPlayer } from './audio.js';

export function renderSidebar(chapterId, sutrasData, loadSutraFn) {
    const chapterList = document.getElementById('chapter-list');
    const sutraList = document.getElementById('sidebar-sutra-list');

    if (chapterList) chapterList.innerHTML = '';
    if (sutraList) sutraList.innerHTML = '';

    renderChapterButtons(chapterId, chapterList);

    if (sutraList) {
        const chapterSutras = sutrasData.filter(s => s.id.startsWith(`${chapterId}.`));
        chapterSutras.forEach(sutra => createSutraLink(sutra, sutraList, loadSutraFn));
    }
}

function renderChapterButtons(activeChapterId, container) {
    if (!container) return;
    const chapters = [
        { id: '1', name: 'Samadhi Pada', count: 51, icon: 'spa' },
        { id: '2', name: 'Sadhana Pada', count: 55, icon: 'self_improvement' },
        { id: '3', name: 'Vibhuti Pada', count: 56, icon: 'wb_twilight' },
        { id: '4', name: 'Kaivalya Pada', count: 34, icon: 'all_inclusive' }
    ];

    chapters.forEach(chap => {
        const isActive = chap.id === activeChapterId;
        const btn = document.createElement('button');
        btn.className = getChapterBtnClass(isActive);
        btn.onclick = () => window.location.href = `chapter.html?id=${chap.id}`;
        btn.innerHTML = getChapterBtnInner(chap, isActive);
        container.appendChild(btn);
    });
}

function getChapterBtnClass(isActive) {
    const base = 'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ';
    return base + (isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800');
}

function getChapterBtnInner(chap, isActive) {
    const iconClass = isActive ? '' : 'text-slate-400';
    const badgeClass = isActive ? 'bg-primary/20 text-primary font-bold' : 'text-slate-400';
    return `
        <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] ${iconClass}">${chap.icon}</span>
            ${chap.name}
        </span>
        <span class="text-xs ${badgeClass} px-1.5 py-0.5 rounded">${chap.count}</span>
    `;
}

function createSutraLink(sutra, container, loadSutraFn) {
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md truncate transition-colors';
    link.dataset.id = sutra.id;

    link.onclick = (e) => {
        e.preventDefault();
        loadSutraFn(sutra.id);
    };

    const previewTxt = sutra.pronunciation ? sutra.pronunciation.split(' ').slice(0, 4).join(' ') + '...' : '';
    link.textContent = `${sutra.id} ${previewTxt}`;
    container.appendChild(link);
}

export function updateActiveSidebarItem(id) {
    document.querySelectorAll('#sidebar-sutra-list a').forEach(a => {
        if (a.dataset.id === id) {
            a.className = 'block px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-md border-l-2 border-primary truncate transition-colors';
            a.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            a.className = 'block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md truncate transition-colors';
        }
    });
}

export function setupSutraDOM(sutra, currentChapterId) {
    const mainContent = document.getElementById('sutra-detail-view');
    const indicator = document.getElementById('current-sutra-indicator');
    const noteIndicator = document.getElementById('note-sutra-id');

    if (indicator) indicator.textContent = sutra.id;
    if (noteIndicator) noteIndicator.textContent = sutra.id;

    if (mainContent) {
        mainContent.innerHTML = getSutraHtml(sutra, currentChapterId);
        mainContent.scrollTop = 0;
    }

    initAudioPlayer(sutra.id);
}

function getSutraHtml(sutra, chapterId) {
    return `
        <div class="max-w-4xl mx-auto pb-24 animate-fade-in">
            ${getSutraHeaderNav(sutra.id, chapterId)}
            <section class="text-center mb-16 relative">
                <div class="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
                    <span class="material-symbols-outlined">self_improvement</span>
                </div>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight tracking-tight font-kr-serif break-keep break-words">
                    ${sutra.sanskrit || ''}
                </h1>
                <h2 class="text-xl md:text-2xl font-light text-slate-600 dark:text-slate-400 italic mb-8 font-serif break-keep break-words">
                    ${sutra.pronunciation || ''}
                </h2>
                <div class="text-lg text-slate-500 dark:text-slate-500 mb-8 font-kr-serif break-keep break-words leading-relaxed">
                    ${formatPronunciationKr(sutra.pronunciation_kr || '')}
                </div>
                ${getAudioPlayerHtml(sutra.id)}
                <div class="flex flex-wrap justify-center gap-3 text-sm font-display leading-relaxed max-w-2xl mx-auto">
                    ${renderWordBreakdown(sutra)}
                </div>
            </section>
            <div class="w-full h-px bg-primary/10 mb-12"></div>
            <div class="space-y-6 max-w-3xl mx-auto">
                ${renderTranslations(sutra)}
            </div>
        </div>
    `;
}

function getSutraHeaderNav(sutraId, chapterId) {
    return `
        <nav class="flex items-center gap-2 text-sm text-slate-400 mb-8 font-display">
            <span class="hover:text-primary cursor-pointer">Chapter ${chapterId}</span>
            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
            <span class="font-medium text-slate-600 dark:text-slate-300">Sutra ${sutraId}</span>
        </nav>
    `;
}

function getAudioPlayerHtml(sutraId) {
    return `
        <div class="flex flex-col items-center mb-10 w-full max-w-md mx-auto">
            <div id="audio-player-${sutraId}" class="w-full bg-white dark:bg-slate-800 border border-primary/20 rounded-full px-4 py-2 shadow-sm flex items-center gap-4 animate-fade-in">
                <button id="play-pause-btn-${sutraId}" class="shrink-0 size-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-[24px]">play_arrow</span>
                </button>
                <span id="current-time-${sutraId}" class="text-xs font-mono text-slate-500 w-10 text-right">0:00</span>
                <div class="relative flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full cursor-pointer group">
                     <div id="progress-bar-${sutraId}" class="absolute top-0 left-0 h-full bg-primary rounded-full w-0 transition-all duration-100"></div>
                     <input type="range" id="seek-slider-${sutraId}" min="0" max="100" value="0" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10">
                </div>
                <span id="duration-${sutraId}" class="text-xs font-mono text-slate-500 w-10">0:00</span>
                <audio id="audio-${sutraId}" src="mp3/${sutraId.replace('.', '-')}.mp3"></audio>
            </div>
        </div>
    `;
}

function formatPronunciationKr(text) {
    if (!text) return '';
    return text.split('｜').map(chunk => {
        const trimmed = chunk.trim();
        if (!trimmed) return '';
        return `<span class="inline-block whitespace-nowrap">${trimmed}</span>`;
    }).join('<span class="mx-1 opacity-50">｜</span>');
}

function renderWordBreakdown(sutra) {
    if (sutra.tokens && sutra.tokens.length > 0) {
        return sutra.tokens.map(token => getWordHtmlFromToken(token)).join('');
    }
    if (!sutra.word_meanings) return '';

    const entries = Object.entries(sutra.word_meanings);
    return entries.map(([word, meaning]) => getWordHtmlFallback(word, meaning)).join('');
}

function getWordHtmlFromToken(token) {
    const word = token.surface || token.lemma;
    let meaning = (token.meaning_ko || '').trim();
    let shortMeaning = (token.meaning_ko_short || '').trim();
    const etymology = token.etymology_ko || '';

    let htmlContent = '';
    const goldClass = 'text-[#b08d45] dark:text-[#c5a059]';
    const cleanMeaning = meaning.replace(/[^가-힣a-zA-Z0-9]/g, '');
    const cleanShort = shortMeaning.replace(/[^가-힣a-zA-Z0-9]/g, '');
    const isDuplicate = cleanShort && (cleanMeaning === cleanShort || cleanMeaning.startsWith(cleanShort));

    if (shortMeaning && meaning && !isDuplicate) {
        htmlContent += `<span class="font-bold ${goldClass} mr-1">${shortMeaning}</span>`;
        htmlContent += `<span class="opacity-90 text-slate-600 dark:text-slate-400">${meaning}</span>`;
    } else {
        const displayMeaning = (shortMeaning && meaning && isDuplicate) ? meaning : (shortMeaning || meaning);
        htmlContent += `<span class="font-bold ${goldClass}">${displayMeaning}</span>`;
    }

    if (etymology) htmlContent += `<br><span class="text-xs opacity-50 mt-1 block font-normal">root: ${etymology}</span>`;

    return `
        <span class="inline-flex flex-col items-start gap-0.5 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-[#b08d45]/30 transition-colors text-left">
            <span class="font-serif font-bold text-slate-800 dark:text-slate-200 text-lg leading-none mb-1">${word}</span>
            <span class="text-sm leading-snug">${htmlContent}</span>
        </span>
    `;
}

function getWordHtmlFallback(word, meaning) {
    const formattedMeaning = meaning.replace(/</g, '<br><span class="opacity-60 text-xs">&lt;</span>');
    return `
        <span class="inline-flex flex-col items-start gap-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors text-left">
            <strong class="font-serif text-slate-900 dark:text-white font-bold text-lg leading-none">${word}</strong>
            <span class="text-slate-600 dark:text-slate-400 text-sm leading-snug">${formattedMeaning}</span>
        </span>
    `;
}

function renderTranslations(sutra) {
    const fixedKeys = ['id', 'sanskrit', 'pronunciation', 'pronunciation_kr', 'word_meanings', 'pada', 'tokens'];
    const translationKeys = Object.keys(sutra).filter(key => !fixedKeys.includes(key)).sort();
    let html = '';

    const configs = [
        { key: '2.english', author: 'Alice A. Bailey', title: 'The Light of the Soul', icon: 'auto_stories', cls: 'bg-purple-50 text-purple-600' },
        { key: '3.korean-1', author: '심상학회', title: '직역 및 해설', icon: 'diversity_3', cls: 'bg-green-50 text-green-600' },
        { prefix: 'bae', author: '배철현', title: '배철현의 요가수트라 강독', icon: 'person_search', cls: 'bg-orange-50 text-orange-600' },
        { prefix: 'ox', author: 'Nicholas Sutton', title: 'Oxford Centre for Hindu Studies', icon: 'school', cls: 'bg-blue-50 text-blue-600' }
    ];

    configs.forEach(cfg => {
        let keys = cfg.prefix ? translationKeys.filter(k => k.includes(cfg.prefix)) : (translationKeys.includes(cfg.key) ? [cfg.key] : []);
        if (cfg.prefix === 'ox' && keys.length) {
            keys.sort((a, b) => (a.includes('ox-en') ? -1 : (b.includes('ox-en') ? 1 : a.localeCompare(b))));
        } else if (cfg.prefix === 'bae') {
            keys.sort();
        }

        if (keys.length > 0) html += renderTranslationCard(sutra, keys, cfg.author, cfg.title, cfg.icon, cfg.cls);
    });

    if (translationKeys.includes('7.dan')) {
        html += renderTranslationCard(sutra, ['7.dan'], '단요가', '요가수트라 해설', 'edit', 'bg-slate-50 text-slate-600');
    }

    return html;
}

function renderTranslationCard(sutra, keys, authorName, subTitle, icon, iconClass) {
    const contents = keys.map(key => {
        const isEnglish = key.includes('english') || key.includes('ox-en');
        const langClass = isEnglish ? 'lang-en' : 'lang-ko';
        const label = formatLabel(key);
        const textStr = (sutra[key] || '').trim();
        return `
            <div class="mb-6 last:mb-0">
                <div class="section-label">${label}</div>
                <div class="content-block">
                    <blockquote class="${langClass} text-[1.05rem] text-[#1f2937] dark:text-[#d1d5db] whitespace-pre-wrap">${textStr}</blockquote>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="max-w-[720px] mx-auto bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-primary/10 hover:border-primary/40 transition-all hover:shadow-md group text-left">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-full ${iconClass} flex items-center justify-center">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white">${authorName}</h3>
                        <p class="text-xs text-slate-500">${subTitle}</p>
                    </div>
                </div>
            </div>
            ${contents}
        </div>
    `;
}

function formatLabel(key) {
    if (key.includes('bae_jik')) return '직역 (Literal)';
    if (key.includes('bae_uu')) return '의역 (Meaning)';
    if (key.includes('bae_han')) return '한글 발음';
    if (key.includes('ox-en')) return 'English';
    if (key === '8. ox') return 'Korean';
    if (key === '2.english') return 'English';
    if (key === '3.korean-1') return 'Korean';
    if (key === '7.dan') return 'Korean';
    return key;
}

export function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const { colors, icon, iconColor } = getToastStyle(type);

    toast.className = `flex items-center gap-3 px-6 py-3 rounded-full shadow-xl border ${colors} transform transition-all duration-300 translate-y-8 opacity-0 pointer-events-auto min-w-[300px] max-w-sm backdrop-blur-sm bg-white/95 dark:bg-slate-800/95`;
    toast.innerHTML = `<span class="material-symbols-outlined ${iconColor}">${icon}</span><span class="text-sm font-medium font-serif">${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.remove('translate-y-8', 'opacity-0'));

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastStyle(type) {
    if (type === 'error') return { colors: "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-red-500/40", icon: "error", iconColor: "text-red-500" };
    if (type === 'warning') return { colors: "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-orange-500/40", icon: "warning", iconColor: "text-orange-500" };
    return { colors: "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-primary/40", icon: "check_circle", iconColor: "text-primary" };
}
