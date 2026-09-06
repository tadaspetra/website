/**
 * Swap typewriter punctuation for typographic equivalents. At headline sizes
 * a straight ' or " reads as an oversight.
 */
export function smartenPunctuation(text: string): string {
  return text
    .replace(/(\w)'(\w)/g, "$1\u2019$2")
    .replace(/(^|[\s(])'/g, "$1\u2018")
    .replace(/'/g, "\u2019")
    .replace(/(^|[\s(])"/g, "$1\u201C")
    .replace(/"/g, "\u201D")
    .replace(/\.{3}/g, "\u2026")
    .replace(/\s--\s/g, "\u2009\u2014\u2009");
}
