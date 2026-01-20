import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

interface UserState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoading: true,
    isAuthenticated: false
  }),

  getters: {
    email: (state) => state.user?.email ?? null,
    userId: (state) => state.user?.id ?? null
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
      this.isLoading = false
    },

    clearUser() {
      this.user = null
      this.isAuthenticated = false
      this.isLoading = false
    }
  }
})
