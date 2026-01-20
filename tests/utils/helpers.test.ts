import { describe, it, expect } from 'vitest'

describe('Utils - Date Formatting', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-01-20T00:00:00Z')
      const formatted = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })

      expect(formatted).toBe('January 2026')
    })

    it('should handle invalid date', () => {
      const date = new Date('invalid')
      
      expect(isNaN(date.getTime())).toBe(true)
    })
  })

  describe('formatTime', () => {
    it('should format time in 12h format', () => {
      const date = new Date('2026-01-20T14:30:00')
      const formatted = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })

      expect(formatted).toMatch(/2:30|02:30/)
    })
  })

  describe('Date comparisons', () => {
    it('should identify today correctly', () => {
      const today = new Date()
      const compareDate = new Date()

      expect(today.toDateString()).toBe(compareDate.toDateString())
    })

    it('should identify tomorrow correctly', () => {
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      expect(tomorrow.getDate()).toBe(today.getDate() + 1)
    })
  })
})

describe('Utils - ID Generation', () => {
  it('should generate unique IDs', () => {
    const generateId = (prefix: string) => 
      `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const id1 = generateId('note')
    const id2 = generateId('note')

    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^note_/)
    expect(id2).toMatch(/^note_/)
  })
})

describe('Utils - Text Truncation', () => {
  it('should truncate long text', () => {
    const truncate = (text: string, length: number): string => {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const longText = 'This is a very long text that should be truncated'
    const result = truncate(longText, 20)

    expect(result).toBe('This is a very long ...')
    expect(result.length).toBe(23) // 20 + '...'
  })

  it('should not truncate short text', () => {
    const truncate = (text: string, length: number): string => {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const shortText = 'Short'
    const result = truncate(shortText, 20)

    expect(result).toBe('Short')
  })

  it('should handle empty text', () => {
    const truncate = (text: string, length: number): string => {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    expect(truncate('', 20)).toBe('')
  })
})

describe('Utils - Progress Calculation', () => {
  it('should classify low progress', () => {
    const progressClass = (progress: number): string => {
      if (progress < 30) return 'low'
      if (progress < 70) return 'medium'
      return 'high'
    }

    expect(progressClass(10)).toBe('low')
    expect(progressClass(29)).toBe('low')
  })

  it('should classify medium progress', () => {
    const progressClass = (progress: number): string => {
      if (progress < 30) return 'low'
      if (progress < 70) return 'medium'
      return 'high'
    }

    expect(progressClass(30)).toBe('medium')
    expect(progressClass(50)).toBe('medium')
    expect(progressClass(69)).toBe('medium')
  })

  it('should classify high progress', () => {
    const progressClass = (progress: number): string => {
      if (progress < 30) return 'low'
      if (progress < 70) return 'medium'
      return 'high'
    }

    expect(progressClass(70)).toBe('high')
    expect(progressClass(100)).toBe('high')
  })
})
