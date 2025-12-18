/**
 * Escapes special regex characters in a string to make it safe for use in a RegExp
 * @param str - The string to escape
 * @returns The escaped string
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlights matching text in a string by wrapping it with mark elements
 * @param text - The text to search in
 * @param query - The search query
 * @returns Array of text segments with highlighted matches
 */
export function highlightText(
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> {
  if (!query.trim()) {
    return [{ text, highlight: false }]
  }

  const escapedQuery = escapeRegExp(query.trim())
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)

  return parts
    .filter(part => part.length > 0)
    .map(part => ({
      text: part,
      highlight: regex.test(part),
    }))
}

/**
 * Counts the number of matches for a query in a text
 * @param text - The text to search in
 * @param query - The search query
 * @returns The number of matches
 */
export function countMatches(text: string, query: string): number {
  if (!query.trim()) {
    return 0
  }

  const escapedQuery = escapeRegExp(query.trim())
  const regex = new RegExp(escapedQuery, 'gi')
  const matches = text.match(regex)
  return matches ? matches.length : 0
}
