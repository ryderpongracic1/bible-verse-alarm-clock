/**
 * Settings.ts
 * Types for app settings and Bible book selection
 */

export interface BibleBook {
  name: string;
  abbreviation: string;
  apiId: string;
  testament: 'OT' | 'NT';
  chapters: number;
}

export interface AppSettings {
  useFamousVerses: boolean;
  selectedBooks: string[]; // Array of book apiIds
  verseSource: 'random' | 'selected' | 'famous';
}

// Note: selectedBooks will be initialized with all books in SettingsStorage
export const DEFAULT_SETTINGS: AppSettings = {
  useFamousVerses: false,
  selectedBooks: [], // Will be populated with all books on first load
  verseSource: 'random',
};

// All 66 Bible books with API information
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament (39 books)
  { name: 'Genesis', abbreviation: 'Gen', apiId: 'GEN', testament: 'OT', chapters: 50 },
  { name: 'Exodus', abbreviation: 'Exo', apiId: 'EXO', testament: 'OT', chapters: 40 },
  { name: 'Leviticus', abbreviation: 'Lev', apiId: 'LEV', testament: 'OT', chapters: 27 },
  { name: 'Numbers', abbreviation: 'Num', apiId: 'NUM', testament: 'OT', chapters: 36 },
  { name: 'Deuteronomy', abbreviation: 'Deu', apiId: 'DEU', testament: 'OT', chapters: 34 },
  { name: 'Joshua', abbreviation: 'Jos', apiId: 'JOS', testament: 'OT', chapters: 24 },
  { name: 'Judges', abbreviation: 'Jdg', apiId: 'JDG', testament: 'OT', chapters: 21 },
  { name: 'Ruth', abbreviation: 'Rut', apiId: 'RUT', testament: 'OT', chapters: 4 },
  { name: '1 Samuel', abbreviation: '1Sa', apiId: '1SA', testament: 'OT', chapters: 31 },
  { name: '2 Samuel', abbreviation: '2Sa', apiId: '2SA', testament: 'OT', chapters: 24 },
  { name: '1 Kings', abbreviation: '1Ki', apiId: '1KI', testament: 'OT', chapters: 22 },
  { name: '2 Kings', abbreviation: '2Ki', apiId: '2KI', testament: 'OT', chapters: 25 },
  { name: '1 Chronicles', abbreviation: '1Ch', apiId: '1CH', testament: 'OT', chapters: 29 },
  { name: '2 Chronicles', abbreviation: '2Ch', apiId: '2CH', testament: 'OT', chapters: 36 },
  { name: 'Ezra', abbreviation: 'Ezr', apiId: 'EZR', testament: 'OT', chapters: 10 },
  { name: 'Nehemiah', abbreviation: 'Neh', apiId: 'NEH', testament: 'OT', chapters: 13 },
  { name: 'Esther', abbreviation: 'Est', apiId: 'EST', testament: 'OT', chapters: 10 },
  { name: 'Job', abbreviation: 'Job', apiId: 'JOB', testament: 'OT', chapters: 42 },
  { name: 'Psalms', abbreviation: 'Psa', apiId: 'PSA', testament: 'OT', chapters: 150 },
  { name: 'Proverbs', abbreviation: 'Pro', apiId: 'PRO', testament: 'OT', chapters: 31 },
  { name: 'Ecclesiastes', abbreviation: 'Ecc', apiId: 'ECC', testament: 'OT', chapters: 12 },
  { name: 'Song of Solomon', abbreviation: 'Sng', apiId: 'SNG', testament: 'OT', chapters: 8 },
  { name: 'Isaiah', abbreviation: 'Isa', apiId: 'ISA', testament: 'OT', chapters: 66 },
  { name: 'Jeremiah', abbreviation: 'Jer', apiId: 'JER', testament: 'OT', chapters: 52 },
  { name: 'Lamentations', abbreviation: 'Lam', apiId: 'LAM', testament: 'OT', chapters: 5 },
  { name: 'Ezekiel', abbreviation: 'Ezk', apiId: 'EZK', testament: 'OT', chapters: 48 },
  { name: 'Daniel', abbreviation: 'Dan', apiId: 'DAN', testament: 'OT', chapters: 12 },
  { name: 'Hosea', abbreviation: 'Hos', apiId: 'HOS', testament: 'OT', chapters: 14 },
  { name: 'Joel', abbreviation: 'Jol', apiId: 'JOL', testament: 'OT', chapters: 3 },
  { name: 'Amos', abbreviation: 'Amo', apiId: 'AMO', testament: 'OT', chapters: 9 },
  { name: 'Obadiah', abbreviation: 'Oba', apiId: 'OBA', testament: 'OT', chapters: 1 },
  { name: 'Jonah', abbreviation: 'Jon', apiId: 'JON', testament: 'OT', chapters: 4 },
  { name: 'Micah', abbreviation: 'Mic', apiId: 'MIC', testament: 'OT', chapters: 7 },
  { name: 'Nahum', abbreviation: 'Nam', apiId: 'NAM', testament: 'OT', chapters: 3 },
  { name: 'Habakkuk', abbreviation: 'Hab', apiId: 'HAB', testament: 'OT', chapters: 3 },
  { name: 'Zephaniah', abbreviation: 'Zep', apiId: 'ZEP', testament: 'OT', chapters: 3 },
  { name: 'Haggai', abbreviation: 'Hag', apiId: 'HAG', testament: 'OT', chapters: 2 },
  { name: 'Zechariah', abbreviation: 'Zec', apiId: 'ZEC', testament: 'OT', chapters: 14 },
  { name: 'Malachi', abbreviation: 'Mal', apiId: 'MAL', testament: 'OT', chapters: 4 },

  // New Testament (27 books)
  { name: 'Matthew', abbreviation: 'Mat', apiId: 'MAT', testament: 'NT', chapters: 28 },
  { name: 'Mark', abbreviation: 'Mrk', apiId: 'MRK', testament: 'NT', chapters: 16 },
  { name: 'Luke', abbreviation: 'Luk', apiId: 'LUK', testament: 'NT', chapters: 24 },
  { name: 'John', abbreviation: 'Jhn', apiId: 'JHN', testament: 'NT', chapters: 21 },
  { name: 'Acts', abbreviation: 'Act', apiId: 'ACT', testament: 'NT', chapters: 28 },
  { name: 'Romans', abbreviation: 'Rom', apiId: 'ROM', testament: 'NT', chapters: 16 },
  { name: '1 Corinthians', abbreviation: '1Co', apiId: '1CO', testament: 'NT', chapters: 16 },
  { name: '2 Corinthians', abbreviation: '2Co', apiId: '2CO', testament: 'NT', chapters: 13 },
  { name: 'Galatians', abbreviation: 'Gal', apiId: 'GAL', testament: 'NT', chapters: 6 },
  { name: 'Ephesians', abbreviation: 'Eph', apiId: 'EPH', testament: 'NT', chapters: 6 },
  { name: 'Philippians', abbreviation: 'Php', apiId: 'PHP', testament: 'NT', chapters: 4 },
  { name: 'Colossians', abbreviation: 'Col', apiId: 'COL', testament: 'NT', chapters: 4 },
  { name: '1 Thessalonians', abbreviation: '1Th', apiId: '1TH', testament: 'NT', chapters: 5 },
  { name: '2 Thessalonians', abbreviation: '2Th', apiId: '2TH', testament: 'NT', chapters: 3 },
  { name: '1 Timothy', abbreviation: '1Ti', apiId: '1TI', testament: 'NT', chapters: 6 },
  { name: '2 Timothy', abbreviation: '2Ti', apiId: '2TI', testament: 'NT', chapters: 4 },
  { name: 'Titus', abbreviation: 'Tit', apiId: 'TIT', testament: 'NT', chapters: 3 },
  { name: 'Philemon', abbreviation: 'Phm', apiId: 'PHM', testament: 'NT', chapters: 1 },
  { name: 'Hebrews', abbreviation: 'Heb', apiId: 'HEB', testament: 'NT', chapters: 13 },
  { name: 'James', abbreviation: 'Jas', apiId: 'JAS', testament: 'NT', chapters: 5 },
  { name: '1 Peter', abbreviation: '1Pe', apiId: '1PE', testament: 'NT', chapters: 5 },
  { name: '2 Peter', abbreviation: '2Pe', apiId: '2PE', testament: 'NT', chapters: 3 },
  { name: '1 John', abbreviation: '1Jn', apiId: '1JN', testament: 'NT', chapters: 5 },
  { name: '2 John', abbreviation: '2Jn', apiId: '2JN', testament: 'NT', chapters: 1 },
  { name: '3 John', abbreviation: '3Jn', apiId: '3JN', testament: 'NT', chapters: 1 },
  { name: 'Jude', abbreviation: 'Jud', apiId: 'JUD', testament: 'NT', chapters: 1 },
  { name: 'Revelation', abbreviation: 'Rev', apiId: 'REV', testament: 'NT', chapters: 22 },
];

// Helper functions
export const getOldTestamentBooks = (): BibleBook[] => {
  return BIBLE_BOOKS.filter(book => book.testament === 'OT');
};

export const getNewTestamentBooks = (): BibleBook[] => {
  return BIBLE_BOOKS.filter(book => book.testament === 'NT');
};

export const getAllBookApiIds = (): string[] => {
  return BIBLE_BOOKS.map(book => book.apiId);
};

export const getBookByApiId = (apiId: string): BibleBook | undefined => {
  return BIBLE_BOOKS.find(book => book.apiId === apiId);
};
