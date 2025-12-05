/**
 * Formats a heading string by wrapping the last word in an underline span
 * @param heading - The heading text to format
 * @returns HTML string with the last word wrapped in an underline span
 */
export function underlineLastWord(heading: string): string {
  return heading.replace(/(\w+)\s*$/, '<span class="u-underlined">$1</span>');
}
