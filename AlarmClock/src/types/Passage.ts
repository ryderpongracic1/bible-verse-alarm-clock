export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

export interface TextPassage {
  id: string;
  text: string;
  source: string; // e.g., "John 3:16 (KJV)"
  shortReference: string; // e.g., "John 3:16"
  length: number;
}

export enum PassageDifficulty {
  Easy = 'easy',      // 1 verse, ~20-50 characters
  Medium = 'medium',  // 1 verse, ~50-80 characters
  Hard = 'hard',      // 2 verses or longer verse, ~80-150 characters
}

export interface PassageConfig {
  version: string;
  book: string;
  chapter: number;
  verse: number;
  verseCount?: number; // For multiple verses (hard mode)
}

// Popular Bible verses by difficulty
export const PRESET_PASSAGES: Record<PassageDifficulty, PassageConfig[]> = {
  [PassageDifficulty.Easy]: [
    {version: 'en-kjv', book: 'john', chapter: 11, verse: 35}, // "Jesus wept."
    {version: 'en-kjv', book: 'psalms', chapter: 46, verse: 10}, // "Be still, and know..."
    {version: 'en-kjv', book: '1-thessalonians', chapter: 5, verse: 16}, // "Rejoice evermore."
    {version: 'en-kjv', book: '1-thessalonians', chapter: 5, verse: 17}, // "Pray without ceasing."
    {version: 'en-kjv', book: 'psalms', chapter: 118, verse: 24}, // "This is the day..."
  ],
  [PassageDifficulty.Medium]: [
    {version: 'en-kjv', book: 'john', chapter: 3, verse: 16}, // "For God so loved..."
    {version: 'en-kjv', book: 'philippians', chapter: 4, verse: 13}, // "I can do all things..."
    {version: 'en-kjv', book: 'proverbs', chapter: 3, verse: 5}, // "Trust in the LORD..."
    {version: 'en-kjv', book: 'jeremiah', chapter: 29, verse: 11}, // "For I know the plans..."
    {version: 'en-kjv', book: 'psalms', chapter: 23, verse: 1}, // "The LORD is my shepherd..."
  ],
  [PassageDifficulty.Hard]: [
    {version: 'en-kjv', book: 'romans', chapter: 8, verse: 28}, // "And we know that all things..."
    {version: 'en-kjv', book: 'isaiah', chapter: 40, verse: 31}, // "But they that wait upon..."
    {version: 'en-kjv', book: 'matthew', chapter: 6, verse: 33}, // "But seek ye first..."
    {version: 'en-kjv', book: 'proverbs', chapter: 3, verse: 5, verseCount: 2}, // Two verses
    {version: 'en-kjv', book: 'psalms', chapter: 23, verse: 1, verseCount: 2}, // Two verses
  ],
};
