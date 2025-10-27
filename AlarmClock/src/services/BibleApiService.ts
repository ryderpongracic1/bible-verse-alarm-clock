import {
  BibleVerse,
  TextPassage,
  PassageDifficulty,
  PassageConfig,
  PRESET_PASSAGES,
} from '../types/Passage';
import {config} from '../config/config';
import {SettingsStorage} from './SettingsStorage';
import FAMOUS_VERSES from '../data/famousVerses.json';

const BASE_URL = config.BIBLE_API_BASE_URL;
const API_KEY = config.BIBLE_API_KEY;
const KJV_BIBLE_ID = config.KJV_BIBLE_ID;

// Bible book metadata
interface BookMetadata {
  name: string;
  usfm: string;
  chapters: number;
  avgVersesPerChapter: number; // Average for random selection
}

// Comprehensive list of Bible books
const BIBLE_BOOKS: BookMetadata[] = [
  // Old Testament
  {name: 'genesis', usfm: 'GEN', chapters: 50, avgVersesPerChapter: 26},
  {name: 'exodus', usfm: 'EXO', chapters: 40, avgVersesPerChapter: 25},
  {name: 'leviticus', usfm: 'LEV', chapters: 27, avgVersesPerChapter: 24},
  {name: 'numbers', usfm: 'NUM', chapters: 36, avgVersesPerChapter: 26},
  {name: 'deuteronomy', usfm: 'DEU', chapters: 34, avgVersesPerChapter: 28},
  {name: 'joshua', usfm: 'JOS', chapters: 24, avgVersesPerChapter: 21},
  {name: 'judges', usfm: 'JDG', chapters: 21, avgVersesPerChapter: 24},
  {name: 'ruth', usfm: 'RUT', chapters: 4, avgVersesPerChapter: 18},
  {name: '1-samuel', usfm: '1SA', chapters: 31, avgVersesPerChapter: 25},
  {name: '2-samuel', usfm: '2SA', chapters: 24, avgVersesPerChapter: 24},
  {name: '1-kings', usfm: '1KI', chapters: 22, avgVersesPerChapter: 27},
  {name: '2-kings', usfm: '2KI', chapters: 25, avgVersesPerChapter: 23},
  {name: '1-chronicles', usfm: '1CH', chapters: 29, avgVersesPerChapter: 26},
  {name: '2-chronicles', usfm: '2CH', chapters: 36, avgVersesPerChapter: 24},
  {name: 'ezra', usfm: 'EZR', chapters: 10, avgVersesPerChapter: 22},
  {name: 'nehemiah', usfm: 'NEH', chapters: 13, avgVersesPerChapter: 25},
  {name: 'esther', usfm: 'EST', chapters: 10, avgVersesPerChapter: 17},
  {name: 'job', usfm: 'JOB', chapters: 42, avgVersesPerChapter: 20},
  {name: 'psalms', usfm: 'PSA', chapters: 150, avgVersesPerChapter: 12},
  {name: 'proverbs', usfm: 'PRO', chapters: 31, avgVersesPerChapter: 22},
  {name: 'ecclesiastes', usfm: 'ECC', chapters: 12, avgVersesPerChapter: 14},
  {name: 'song-of-solomon', usfm: 'SNG', chapters: 8, avgVersesPerChapter: 13},
  {name: 'isaiah', usfm: 'ISA', chapters: 66, avgVersesPerChapter: 21},
  {name: 'jeremiah', usfm: 'JER', chapters: 52, avgVersesPerChapter: 26},
  {name: 'lamentations', usfm: 'LAM', chapters: 5, avgVersesPerChapter: 17},
  {name: 'ezekiel', usfm: 'EZK', chapters: 48, avgVersesPerChapter: 23},
  {name: 'daniel', usfm: 'DAN', chapters: 12, avgVersesPerChapter: 21},
  {name: 'hosea', usfm: 'HOS', chapters: 14, avgVersesPerChapter: 11},
  {name: 'joel', usfm: 'JOL', chapters: 3, avgVersesPerChapter: 16},
  {name: 'amos', usfm: 'AMO', chapters: 9, avgVersesPerChapter: 13},
  {name: 'obadiah', usfm: 'OBA', chapters: 1, avgVersesPerChapter: 21},
  {name: 'jonah', usfm: 'JON', chapters: 4, avgVersesPerChapter: 10},
  {name: 'micah', usfm: 'MIC', chapters: 7, avgVersesPerChapter: 11},
  {name: 'nahum', usfm: 'NAM', chapters: 3, avgVersesPerChapter: 13},
  {name: 'habakkuk', usfm: 'HAB', chapters: 3, avgVersesPerChapter: 13},
  {name: 'zephaniah', usfm: 'ZEP', chapters: 3, avgVersesPerChapter: 13},
  {name: 'haggai', usfm: 'HAG', chapters: 2, avgVersesPerChapter: 15},
  {name: 'zechariah', usfm: 'ZEC', chapters: 14, avgVersesPerChapter: 14},
  {name: 'malachi', usfm: 'MAL', chapters: 4, avgVersesPerChapter: 14},
  // New Testament
  {name: 'matthew', usfm: 'MAT', chapters: 28, avgVersesPerChapter: 24},
  {name: 'mark', usfm: 'MRK', chapters: 16, avgVersesPerChapter: 28},
  {name: 'luke', usfm: 'LUK', chapters: 24, avgVersesPerChapter: 28},
  {name: 'john', usfm: 'JHN', chapters: 21, avgVersesPerChapter: 24},
  {name: 'acts', usfm: 'ACT', chapters: 28, avgVersesPerChapter: 26},
  {name: 'romans', usfm: 'ROM', chapters: 16, avgVersesPerChapter: 22},
  {name: '1-corinthians', usfm: '1CO', chapters: 16, avgVersesPerChapter: 22},
  {name: '2-corinthians', usfm: '2CO', chapters: 13, avgVersesPerChapter: 17},
  {name: 'galatians', usfm: 'GAL', chapters: 6, avgVersesPerChapter: 18},
  {name: 'ephesians', usfm: 'EPH', chapters: 6, avgVersesPerChapter: 20},
  {name: 'philippians', usfm: 'PHP', chapters: 4, avgVersesPerChapter: 20},
  {name: 'colossians', usfm: 'COL', chapters: 4, avgVersesPerChapter: 18},
  {name: '1-thessalonians', usfm: '1TH', chapters: 5, avgVersesPerChapter: 18},
  {name: '2-thessalonians', usfm: '2TH', chapters: 3, avgVersesPerChapter: 13},
  {name: '1-timothy', usfm: '1TI', chapters: 6, avgVersesPerChapter: 16},
  {name: '2-timothy', usfm: '2TI', chapters: 4, avgVersesPerChapter: 16},
  {name: 'titus', usfm: 'TIT', chapters: 3, avgVersesPerChapter: 13},
  {name: 'philemon', usfm: 'PHM', chapters: 1, avgVersesPerChapter: 25},
  {name: 'hebrews', usfm: 'HEB', chapters: 13, avgVersesPerChapter: 20},
  {name: 'james', usfm: 'JAS', chapters: 5, avgVersesPerChapter: 17},
  {name: '1-peter', usfm: '1PE', chapters: 5, avgVersesPerChapter: 18},
  {name: '2-peter', usfm: '2PE', chapters: 3, avgVersesPerChapter: 15},
  {name: '1-john', usfm: '1JN', chapters: 5, avgVersesPerChapter: 18},
  {name: '2-john', usfm: '2JN', chapters: 1, avgVersesPerChapter: 13},
  {name: '3-john', usfm: '3JN', chapters: 1, avgVersesPerChapter: 14},
  {name: 'jude', usfm: 'JUD', chapters: 1, avgVersesPerChapter: 25},
  {name: 'revelation', usfm: 'REV', chapters: 22, avgVersesPerChapter: 18},
];

// Create a map for quick lookups
const BOOK_ID_MAP: Record<string, string> = {};
const BOOK_METADATA_MAP: Record<string, BookMetadata> = {};

BIBLE_BOOKS.forEach(book => {
  BOOK_ID_MAP[book.name] = book.usfm;
  BOOK_METADATA_MAP[book.name] = book;
});

export class BibleApiService {
  /**
   * Fetch a specific Bible verse from the API
   */
  static async fetchVerse(
    version: string,
    book: string,
    chapter: number,
    verse: number,
  ): Promise<BibleVerse | null> {
    try {
      const bookId = BOOK_ID_MAP[book.toLowerCase()];
      if (!bookId) {
        console.error(`Unknown book: ${book}`);
        return null;
      }

      // Construct passage ID (e.g., "JHN.3.16")
      const passageId = `${bookId}.${chapter}.${verse}`;
      const url = `${BASE_URL}/bibles/${KJV_BIBLE_ID}/passages/${passageId}`;

      console.log(`Fetching from API: ${url}`);

      const response = await fetch(url, {
        headers: {
          'api-key': API_KEY,
        },
      });

      console.log(`API Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch verse: ${response.status}`, errorText);
        return null;
      }

      const data = await response.json();
      console.log('Raw API response:', JSON.stringify(data).substring(0, 200));

      // Extract clean text from the response
      let text = data.data?.content || '';

      // Clean the text
      text = this.cleanText(text);

      if (!text) {
        console.error('No text content in API response');
        return null;
      }

      console.log(`Fetched verse successfully: ${text.substring(0, 50)}...`);

      return {
        book,
        chapter,
        verse,
        text,
        version,
      };
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      return null;
    }
  }

  /**
   * Fetch multiple consecutive verses
   */
  static async fetchVerses(
    version: string,
    book: string,
    chapter: number,
    startVerse: number,
    count: number,
  ): Promise<string> {
    try {
      const bookId = BOOK_ID_MAP[book.toLowerCase()];
      if (!bookId) {
        console.error(`Unknown book: ${book}`);
        return '';
      }

      const endVerse = startVerse + count - 1;
      // Construct passage range (e.g., "JHN.3.16-JHN.3.17")
      const passageId = `${bookId}.${chapter}.${startVerse}-${bookId}.${chapter}.${endVerse}`;
      const url = `${BASE_URL}/bibles/${KJV_BIBLE_ID}/passages/${passageId}`;

      const response = await fetch(url, {
        headers: {
          'api-key': API_KEY,
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch verses: ${response.status}`);
        return '';
      }

      const data = await response.json();

      // Extract clean text from the response
      let text = data.data?.content || '';

      // Clean the text
      text = this.cleanText(text);

      return text;
    } catch (error) {
      console.error('Error fetching Bible verses:', error);
      return '';
    }
  }

  /**
   * Get a random passage (no difficulty levels)
   * Respects user settings for famous verses and book selection
   */
  static async getRandomPassage(): Promise<TextPassage | null> {
    try {
      // Check user settings
      const settings = await SettingsStorage.getSettings();

      // If using famous verses mode, get a random famous verse
      if (settings.useFamousVerses) {
        console.log('Using famous verses mode');
        return this.getFamousVerse();
      }

      // Try up to 3 times to get a random passage from Bible (respecting book selection)
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`Attempting to fetch random passage (attempt ${attempt}/${maxAttempts})`);
          const randomPassage = await this.getRandomPassageFromBible(settings.selectedBooks);
          if (randomPassage) {
            console.log('Successfully fetched random passage from Bible');
            return randomPassage;
          }
        } catch (error) {
          console.error(`Attempt ${attempt} failed:`, error);
        }
      }

      // Fallback to a preset passage if all random attempts fail
      console.log('All random attempts failed, using preset passage as fallback');
      const allPresets = [
        ...PRESET_PASSAGES[PassageDifficulty.Easy],
        ...PRESET_PASSAGES[PassageDifficulty.Medium],
        ...PRESET_PASSAGES[PassageDifficulty.Hard],
      ];
      const randomConfig = allPresets[Math.floor(Math.random() * allPresets.length)];

      return this.getPassageFromConfig(randomConfig);
    } catch (error) {
      console.error('Error in getRandomPassage:', error);
      // Fallback to famous verse if settings fail
      return this.getFamousVerse();
    }
  }

  /**
   * Get a random verse from the famous verses collection
   */
  static getFamousVerse(): TextPassage {
    const randomIndex = Math.floor(Math.random() * FAMOUS_VERSES.length);
    const verse = FAMOUS_VERSES[randomIndex];

    return {
      id: `famous_${randomIndex}`,
      text: verse.text,
      source: `${verse.reference} (KJV)`,
      shortReference: verse.reference,
      length: verse.text.length,
    };
  }

  /**
   * Get a truly random passage from anywhere in the Bible
   * @param selectedBooks Array of book API IDs to filter by
   */
  private static async getRandomPassageFromBible(selectedBooks: string[] = []): Promise<TextPassage | null> {
    // Filter books based on user selection
    let availableBooks = BIBLE_BOOKS;

    // If books are selected, filter to only those books
    if (selectedBooks.length > 0) {
      availableBooks = BIBLE_BOOKS.filter(book => selectedBooks.includes(book.usfm));
      console.log(`Filtering to ${availableBooks.length} selected books`);
    } else {
      // Safety fallback: if somehow no books selected, use all books
      console.warn('No books selected, using all books as fallback');
    }

    // Final safety check
    if (availableBooks.length === 0) {
      console.warn('No available books after filtering, using all books');
      availableBooks = BIBLE_BOOKS;
    }

    // Randomly select a book from available books
    const randomBook = availableBooks[Math.floor(Math.random() * availableBooks.length)];

    // Randomly select a chapter
    const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;

    // Randomly select a verse (using average verses per chapter)
    // We'll pick a starting verse in the first half to avoid going out of bounds
    const maxStartVerse = Math.max(1, Math.floor(randomBook.avgVersesPerChapter / 2));
    const randomVerse = Math.floor(Math.random() * maxStartVerse) + 1;

    // Randomly decide if we want 1 or 2 verses (50% chance each)
    const verseCount = Math.random() < 0.5 ? 1 : 2;

    console.log(`Randomly selected: ${randomBook.name} ${randomChapter}:${randomVerse}${verseCount > 1 ? '-' + (randomVerse + verseCount - 1) : ''}`);

    // Create a config for this random selection
    const config: PassageConfig = {
      version: 'en-kjv',
      book: randomBook.name,
      chapter: randomChapter,
      verse: randomVerse,
      verseCount: verseCount > 1 ? verseCount : undefined,
    };

    // Fetch the passage
    const passage = await this.getPassageFromConfig(config);

    // Basic validation - just ensure we have text
    if (passage && passage.text && passage.text.length >= 10) {
      return passage;
    }

    // If the passage is too short or invalid, return null to trigger retry
    console.log('Random passage was too short or invalid');
    return null;
  }

  /**
   * Get a passage from a specific config
   */
  static async getPassageFromConfig(
    config: PassageConfig,
  ): Promise<TextPassage | null> {
    try {
      console.log(`Fetching passage: ${config.book} ${config.chapter}:${config.verse}`);

      const verseCount = config.verseCount || 1;
      let text: string;

      if (verseCount === 1) {
        const verse = await this.fetchVerse(
          config.version,
          config.book,
          config.chapter,
          config.verse,
        );
        if (!verse) {
          console.error('Failed to fetch verse from API');
          return null;
        }
        text = verse.text;
      } else {
        text = await this.fetchVerses(
          config.version,
          config.book,
          config.chapter,
          config.verse,
          verseCount,
        );
        if (!text) {
          console.error('Failed to fetch verses from API');
          return null;
        }
      }

      console.log('API returned text:', text.substring(0, 100));

      // Text is already cleaned in fetchVerse/fetchVerses
      // But clean again to be safe
      text = this.cleanText(text);

      console.log('Cleaned text:', text.substring(0, 100));

      if (!text || text.length < 5) {
        console.error('Text too short after cleaning');
        return null;
      }

      // Create source reference
      const bookName = this.formatBookName(config.book);
      const verseRef =
        verseCount > 1
          ? `${config.verse}-${config.verse + verseCount - 1}`
          : `${config.verse}`;
      const shortReference = `${bookName} ${config.chapter}:${verseRef}`;
      const source = `${shortReference} (EN-KJV)`;

      return {
        id: `${config.book}_${config.chapter}_${config.verse}`,
        text,
        source,
        shortReference,
        length: text.length,
      };
    } catch (error) {
      console.error('Error getting passage:', error);
      return null;
    }
  }

  /**
   * Clean up text by removing extra whitespace and formatting
   */
  private static cleanText(text: string): string {
    return text
      // Remove HTML tags and their content for verse numbers (e.g., <span class="v">31</span>)
      .replace(/<span[^>]*class="v"[^>]*>.*?<\/span>/gi, ' ')
      .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, ' ')
      // Remove verse numbers at the start of text (e.g., "31But" -> "But")
      // This handles numbers directly concatenated to words
      .replace(/^\s*\d+([A-Z])/g, '$1')
      // Remove verse numbers after spaces (e.g., " 31But" -> " But")
      .replace(/\s+\d+([A-Z])/g, ' $1')
      // Remove standalone verse numbers at the beginning
      .replace(/^\s*\d+\s+/, '')
      // Remove verse numbers that appear mid-text with spaces
      .replace(/\s+\d+\s+/g, ' ')
      // Remove verse reference patterns like "Isaiah 40:31 - 31"
      .replace(/[A-Za-z\s]+\d+:\d+\s*-\s*\d+/g, '')
      // Remove special formatting characters (pilcrow, section marks, etc.)
      .replace(/[¶§†‡]/g, '')
      // Remove ellipsis (both ... and …)
      .replace(/\.{3,}|…/g, '')
      // Remove footnote markers and content in brackets/parentheses
      .replace(/\[.*?\]/g, '')
      .replace(/\{.*?\}/g, '')
      // Remove common footnote indicators (Heb., Gr., etc.)
      .replace(/\b(Heb\.|Gr\.|Or\.|i\.e\.|cf\.|lit\.|fig\.|prob\.|poss\.)\s*/gi, '')
      // Remove chapter:verse patterns at start
      .replace(/^\d+:\d+\s*/, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Replace newlines with spaces
      .replace(/\n/g, ' ')
      // Remove leading/trailing whitespace and punctuation artifacts
      .replace(/^[,;\s\-]+|[,;\s]+$/g, '')
      .trim();
  }

  /**
   * Format book name for display
   */
  private static formatBookName(book: string): string {
    return book
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get a fallback passage if API fails
   */
  static getFallbackPassage(): TextPassage {
    const fallbacks: TextPassage[] = [
      {
        id: 'fallback_1',
        text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        source: 'John 3:16 (KJV)',
        shortReference: 'John 3:16',
        length: 144,
      },
      {
        id: 'fallback_2',
        text: 'I can do all things through Christ which strengtheneth me.',
        source: 'Philippians 4:13 (KJV)',
        shortReference: 'Philippians 4:13',
        length: 59,
      },
      {
        id: 'fallback_3',
        text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
        source: 'Proverbs 3:5 (KJV)',
        shortReference: 'Proverbs 3:5',
        length: 82,
      },
    ];

    // Return a random fallback
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
