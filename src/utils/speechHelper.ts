/**
 * Speech synthesizer optimized for Saudi Arabic legal text.
 * Cleans dialect formatting, normalizes punctuation, and selects best Arabic voice.
 */

// Expand legal abbreviation tokens for natural reading flow
const LEGAL_PRONUNCIATION_MAP: Array<[RegExp, string]> = [
  [/\bم\/(\d+)\b/g, 'مرسوم ملكي رقم $1'],
  [/\bق\/(\d+)\b/g, 'قرار رقم $1'],
  [/\b(\d{4})\s*هـ\b/g, '$1 هجرية'],
  [/\b(\d+)\s*هـ\b/g, '$1 هجرية'],
  [/\bفقرة\s*\((\d+)\)/g, 'الفقرة $1'],
  [/\bمادة\s*\((\d+)\)/g, 'المادة $1'],
];

export function cleanTextForSpeech(text: string): string {
  if (!text) return '';

  let cleaned = text
    // Remove markdown formatting
    .replace(/[*#_~`]/g, '')
    // Replace markdown bullets with pauses
    .replace(/^[-•*]\s+/gm, '، ')
    // Remove emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Normalize punctuation to natural speech pauses
    .replace(/[؛:]/g, '، ')
    .replace(/\.{2,}/g, '. ')
    // Normalize dashes and brackets
    .replace(/[()[\]{}]/g, ' ')
    // Remove excessive tatweel for speech synthesis engines (speech engines sometimes spell out stretched letters)
    .replace(/ـ+/g, '')
    // Clean excessive spaces and linebreaks
    .replace(/\n+/g, '، ')
    .replace(/\s+/g, ' ')
    .trim();

  // Apply pronunciation optimizations
  for (const [pattern, replacement] of LEGAL_PRONUNCIATION_MAP) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}

/**
 * Split text into natural breath sentences to prevent long-utterance clipping on Chrome / Safari.
 */
export function splitTextIntoChunks(text: string, maxChunkLength = 180): string[] {
  if (!text) return [];
  const sentences = text.split(/(?<=[.!؟،,;\n])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length <= maxChunkLength) {
      current = (current + ' ' + sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length > maxChunkLength) {
        // Fallback split long sentence by commas or spaces
        const words = sentence.split(' ');
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxChunkLength) {
            sub = (sub + ' ' + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) chunks.push(sub);
        current = '';
      } else {
        current = sentence;
      }
    }
  }

  if (current) chunks.push(current);
  return chunks.filter(c => c.trim().length > 0);
}

/**
 * Voice selection ranking premium Arabic voices (Google, Microsoft Naayf/Hamed, Apple Maged/Tarik, Saudi voices)
 */
export function getBestArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Natural / Neural Arabic voices
  const preferredNames = ['naayf', 'hamed', 'shakir', 'salma', 'zayd', 'maged', 'tarik', 'laila', 'google'];
  for (const pref of preferredNames) {
    const found = voices.find(v => 
      v.lang.toLowerCase().startsWith('ar') && v.name.toLowerCase().includes(pref)
    );
    if (found) return found;
  }

  // 2. Try finding Saudi Arabic (ar-SA)
  const saudiVoice = voices.find(v => v.lang === 'ar-SA' || v.lang.replace('_', '-') === 'ar-SA');
  if (saudiVoice) return saudiVoice;

  // 3. Try finding any Arabic voice
  const anyArabic = voices.find(v => v.lang.toLowerCase().startsWith('ar'));
  if (anyArabic) return anyArabic;

  return null;
}
