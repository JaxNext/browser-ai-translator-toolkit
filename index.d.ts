declare module 'language-detector-translator' {
  export interface DetectionResult {
    language: string;
    code: string;
    confidence: number;
    isReliable: boolean;
  }

  export interface TranslationResult {
    translatedText: string;
    from: string;
    to: string;
  }

  export interface TranslationOptions {
    from?: string;
    to?: string;
    format?: 'text' | 'html';
  }

  /**
   * Detects the language of the provided text
   * @param text - The text to detect the language for
   * @returns Promise resolving to detection results
   */
  export function detectLanguage(text: string): Promise<DetectionResult>;

  /**
   * Translates text from one language to another
   * @param text - The text to translate
   * @param options - Translation options
   * @returns Promise resolving to translation results
   */
  export function translate(
    text: string,
    options?: TranslationOptions
  ): Promise<TranslationResult>;

  /**
   * Gets the ISO code for a language name
   * @param languageName - The full name of the language
   * @returns The ISO 639-1 language code
   */
  export function getLanguageCode(languageName: string): string;

  /**
   * Gets the full language name from an ISO code
   * @param languageCode - The ISO 639-1 language code
   * @returns The full name of the language
   */
  export function getLanguageName(languageCode: string): string;
} 