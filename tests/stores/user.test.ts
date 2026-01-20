import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '~/stores/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useUserStore()
    
    expect(store.user).toBeNull()
    expect(store.isLoading).toBe(true)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set user correctly', () => {
    const store = useUserStore()
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      created_at: '2026-01-01T00:00:00Z',
    } as any

    store.setUser(mockUser)

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(store.isLoading).toBe(false)
  })

  it('should clear user correctly', () => {
    const store = useUserStore()
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    } as any

    store.setUser(mockUser)
    store.clearUser()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.isLoading).toBe(false)
  })

  it('should return email from getter', () => {
    const store = useUserStore()
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    } as any

    store.setUser(mockUser)

    expect(store.email).toBe('test@example.com')
  })

  it('should return null email when no user', () => {
    const store = useUserStore()
    
    expect(store.email).toBeNull()
  })

  it('should return userId from getter', () => {
    const store = useUserStore()
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    } as any

    store.setUser(mockUser)

    expect(store.userId).toBe('test-user-id')
  })
})
