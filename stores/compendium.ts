import { defineStore } from 'pinia'
import type { QuickNote, Appointment, Goal } from '~/types'

interface CompendiumState {
  notes: QuickNote[]
  appointments: Appointment[]
  goals: Goal[]
  isLoading: boolean
  isSaving: boolean
  lastSyncedAt: string | null
}

export const useCompendiumStore = defineStore('compendium', {
  state: (): CompendiumState => ({
    notes: [],
    appointments: [],
    goals: [],
    isLoading: false,
    isSaving: false,
    lastSyncedAt: null
  }),

  getters: {
    // Notas
    allNotes: (state) => state.notes,
    getNote: (state) => (id: string) => state.notes.find(n => n.id === id),

    // Appointments
    allAppointments: (state) => state.appointments,
    upcomingAppointments: (state) => {
      const now = new Date()
      return state.appointments
        .filter(a => new Date(a.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    // Goals
    allGoals: (state) => state.goals
  },

  actions: {
    // ============ NOTES ============
    addNote(note: QuickNote) {
      this.notes.push(note)
    },

    updateNote(id: string, updates: Partial<QuickNote>) {
      const index = this.notes.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notes[index] = { ...this.notes[index], ...updates, updatedAt: new Date().toISOString() }
      }
    },

    deleteNote(id: string) {
      this.notes = this.notes.filter(n => n.id !== id)
    },

    // ============ APPOINTMENTS ============
    addAppointment(appointment: Appointment) {
      this.appointments.push(appointment)
    },

    updateAppointment(id: string, updates: Partial<Appointment>) {
      const index = this.appointments.findIndex(a => a.id === id)
      if (index !== -1) {
        this.appointments[index] = { ...this.appointments[index], ...updates }
      }
    },

    deleteAppointment(id: string) {
      this.appointments = this.appointments.filter(a => a.id !== id)
    },

    // ============ GOALS ============
    addGoal(goal: Goal) {
      this.goals.push(goal)
    },

    updateGoal(id: string, updates: Partial<Goal>) {
      const index = this.goals.findIndex(g => g.id === id)
      if (index !== -1) {
        this.goals[index] = { ...this.goals[index], ...updates, updatedAt: new Date().toISOString() }
      }
    },

    deleteGoal(id: string) {
      this.goals = this.goals.filter(g => g.id !== id)
    },

    // ============ SYNC ============
    loadFromData(data: { notes?: QuickNote[], appointments?: Appointment[], goals?: Goal[] }) {
      if (data.notes) this.notes = data.notes
      if (data.appointments) this.appointments = data.appointments
      if (data.goals) this.goals = data.goals
      this.lastSyncedAt = new Date().toISOString()
    },

    getDataForSave() {
      return {
        notes: this.notes,
        appointments: this.appointments,
        goals: this.goals
      }
    },

    clearAll() {
      this.notes = []
      this.appointments = []
      this.goals = []
      this.lastSyncedAt = null
    }
  }
})
