import { escapeRegExp, highlightText, countMatches } from './textHighlight'

describe('textHighlight utilities', () => {
  describe('escapeRegExp', () => {
    it('should escape special regex characters', () => {
      expect(escapeRegExp('hello.world')).toBe('hello\\.world')
      expect(escapeRegExp('test*value')).toBe('test\\*value')
      expect(escapeRegExp('query+text')).toBe('query\\+text')
      expect(escapeRegExp('why?')).toBe('why\\?')
      expect(escapeRegExp('a^b')).toBe('a\\^b')
      expect(escapeRegExp('$price')).toBe('\\$price')
      expect(escapeRegExp('{key}')).toBe('\\{key\\}')
      expect(escapeRegExp('(test)')).toBe('\\(test\\)')
      expect(escapeRegExp('[abc]')).toBe('\\[abc\\]')
      expect(escapeRegExp('a|b')).toBe('a\\|b')
      expect(escapeRegExp('back\\slash')).toBe('back\\\\slash')
    })

    it('should handle strings with no special characters', () => {
      expect(escapeRegExp('hello world')).toBe('hello world')
      expect(escapeRegExp('test123')).toBe('test123')
    })

    it('should handle empty strings', () => {
      expect(escapeRegExp('')).toBe('')
    })
  })

  describe('highlightText', () => {
    it('should return unhighlighted text when query is empty', () => {
      const result = highlightText('Hello world', '')
      expect(result).toEqual([{ text: 'Hello world', highlight: false }])
    })

    it('should return unhighlighted text when query is only whitespace', () => {
      const result = highlightText('Hello world', '   ')
      expect(result).toEqual([{ text: 'Hello world', highlight: false }])
    })

    it('should highlight matching text (case-insensitive)', () => {
      const result = highlightText('Hello world', 'world')
      expect(result).toEqual([
        { text: 'Hello ', highlight: false },
        { text: 'world', highlight: true },
      ])
    })

    it('should highlight case-insensitively', () => {
      const result = highlightText('Hello World', 'WORLD')
      expect(result).toEqual([
        { text: 'Hello ', highlight: false },
        { text: 'World', highlight: true },
      ])
    })

    it('should highlight multiple matches', () => {
      const result = highlightText('the quick brown fox jumps over the lazy dog', 'the')
      expect(result).toEqual([
        { text: 'the', highlight: true },
        { text: ' quick brown fox jumps over ', highlight: false },
        { text: 'the', highlight: true },
        { text: ' lazy dog', highlight: false },
      ])
    })

    it('should handle partial word matches', () => {
      const result = highlightText('JavaScript is amazing', 'script')
      expect(result).toEqual([
        { text: 'Java', highlight: false },
        { text: 'Script', highlight: true },
        { text: ' is amazing', highlight: false },
      ])
    })

    it('should escape special regex characters in query', () => {
      const result = highlightText('Cost is $100.00', '$100')
      expect(result).toEqual([
        { text: 'Cost is ', highlight: false },
        { text: '$100', highlight: true },
        { text: '.00', highlight: false },
      ])
    })

    it('should handle query at the start of text', () => {
      const result = highlightText('Hello world', 'hello')
      expect(result).toEqual([
        { text: 'Hello', highlight: true },
        { text: ' world', highlight: false },
      ])
    })

    it('should handle query at the end of text', () => {
      const result = highlightText('Hello world', 'world')
      expect(result).toEqual([
        { text: 'Hello ', highlight: false },
        { text: 'world', highlight: true },
      ])
    })

    it('should handle query matching entire text', () => {
      const result = highlightText('hello', 'hello')
      expect(result).toEqual([{ text: 'hello', highlight: true }])
    })

    it('should handle no matches', () => {
      const result = highlightText('Hello world', 'xyz')
      expect(result).toEqual([{ text: 'Hello world', highlight: false }])
    })

    it('should handle multi-word queries', () => {
      const result = highlightText('Hello beautiful world', 'beautiful world')
      expect(result).toEqual([
        { text: 'Hello ', highlight: false },
        { text: 'beautiful world', highlight: true },
      ])
    })
  })

  describe('countMatches', () => {
    it('should return 0 for empty query', () => {
      expect(countMatches('Hello world', '')).toBe(0)
    })

    it('should return 0 for whitespace-only query', () => {
      expect(countMatches('Hello world', '   ')).toBe(0)
    })

    it('should count single match', () => {
      expect(countMatches('Hello world', 'world')).toBe(1)
    })

    it('should count multiple matches', () => {
      expect(countMatches('the quick brown fox jumps over the lazy dog', 'the')).toBe(2)
    })

    it('should count case-insensitively', () => {
      expect(countMatches('The Quick THE Brown', 'the')).toBe(2)
    })

    it('should return 0 for no matches', () => {
      expect(countMatches('Hello world', 'xyz')).toBe(0)
    })

    it('should handle overlapping pattern occurrences', () => {
      expect(countMatches('aaaa', 'aa')).toBe(2)
    })

    it('should escape special regex characters', () => {
      expect(countMatches('Price: $100.00 or $200.00', '$')).toBe(2)
    })

    it('should count partial word matches', () => {
      expect(countMatches('JavaScript is great', 'script')).toBe(1)
    })
  })
})
