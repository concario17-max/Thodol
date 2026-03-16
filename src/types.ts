export interface WordMeaningEntry {
    word: string;
    meaning: string;
}

export type WordMeaning = WordMeaningEntry[];

export interface Grammar {
    [key: string]: string;
}

export interface Token {
    id: string;
    surface: string;
    lemma: string;
    pos: string;
    grammar: Grammar;
    meaning_ko: string;
    meaning_ko_short: string;
    etymology_ko?: string;
}

export interface CompoundToken {
    id: string;
    surface: string;
    lemma: string;
    pos: string;
    grammar: Grammar;
    meaning_ko: string;
}

export interface YogaSutra {
    id: string; // e.g., "1.1"
    "6.bae_uu"?: string;
    "8. ox"?: string;
    pronunciation: string;
    pronunciation_kr: string;
    "2.english"?: string;
    "5.bae_jik"?: string;
    "9. ox-en"?: string;
    sanskrit: string;
    "3.korean-1"?: string;
    word_meanings?: WordMeaning;
    tokens?: Token[];
    compound_tokens_original?: CompoundToken[];
}

export interface ChapterMeta {
    chapter: number;
    name_korean: string;
    name_english: string;
    description: string;
    sutraCount: number;
}

export interface YogaChapter {
    chapter: number;
    meta: ChapterMeta;
    sutras: YogaSutra[];
}
