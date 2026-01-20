import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCompendiumStore } from '~/stores/compendium'
import type { QuickNote, Appointment, Goal } from '~/types'

describe('Compendium Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should initialize with empty arrays', () => {
      const store = useCompendiumStore()
      
      expect(store.notes).toEqual([])
      expect(store.appointments).toEqual([])
      expect(store.goals).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.isSaving).toBe(false)
      expect(store.lastSyncedAt).toBeNull()
    })
  })

  describe('Notes', () => {
    it('should add a note', () => {
      const store = useCompendiumStore()
      const note: QuickNote = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }

      store.addNote(note)

      expect(store.notes).toHaveLength(1)
      expect(store.notes[0]).toEqual(note)
    })

    it('should update a note', () => {
      const store = useCompendiumStore()
      const note: QuickNote = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }

      store.addNote(note)
      store.updateNote('note-1', { title: 'Updated Title' })

      expect(store.notes[0].title).toBe('Updated Title')
      expect(store.notes[0].content).toBe('Test content')
    })

    it('should delete a note', () => {
      const store = useCompendiumStore()
      const note: QuickNote = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }

      store.addNote(note)
      store.deleteNote('note-1')

      expect(store.notes).toHaveLength(0)
    })

    it('should get note by id', () => {
      const store = useCompendiumStore()
      const note: QuickNote = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }

      store.addNote(note)

      expect(store.getNote('note-1')).toEqual(note)
      expect(store.getNote('non-existent')).toBeUndefined()
    })
  })

  describe('Appointments', () => {
    it('should add an appointment', () => {
      const store = useCompendiumStore()
      const appointment: Appointment = {
        id: 'apt-1',
        title: 'Meeting',
        date: '2026-01-20',
        time: '10:00',
        description: 'Team meeting',
        createdAt: '2026-01-01T00:00:00Z',
      }

      store.addAppointment(appointment)

      expect(store.appointments).toHaveLength(1)
      expect(store.appointments[0]).toEqual(appointment)
    })

    it('should delete an appointment', () => {
      const store = useCompendiumStore()
      const appointment: Appointment = {
        id: 'apt-1',
        title: 'Meeting',
        date: '2026-01-20',
        time: '10:00',
        createdAt: '2026-01-01T00:00:00Z',
      }

      store.addAppointment(appointment)
      store.deleteAppointment('apt-1')

      expect(store.appointments).toHaveLength(0)
    })

    it('should return upcoming appointments sorted by date', () => {
      const store = useCompendiumStore()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dayAfter = new Date()
      dayAfter.setDate(dayAfter.getDate() + 2)

      store.addAppointment({
        id: 'apt-2',
        title: 'Later Meeting',
        date: dayAfter.toISOString().split('T')[0],
        time: '10:00',
        createdAt: '2026-01-01T00:00:00Z',
      })

      store.addAppointment({
        id: 'apt-1',
        title: 'Tomorrow Meeting',
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00',
        createdAt: '2026-01-01T00:00:00Z',
      })

      const upcoming = store.upcomingAppointments

      expect(upcoming[0].title).toBe('Tomorrow Meeting')
      expect(upcoming[1].title).toBe('Later Meeting')
    })
  })

  describe('Goals', () => {
    it('should add a goal', () => {
      const store = useCompendiumStore()
      const goal: Goal = {
        id: 'goal-1',
        title: 'Learn Vue',
        description: 'Master Vue.js',
        progress: 50,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }

      store.addGoal(goal)

      expect(store.goals).toHaveLength(1)
      expect(store.goals[0]).toEqual(goal)
    })

    it('should update goal progress', () => {
      const store = useCompendiumStore()
      const goal: Goal = {
        id: 'goal-1',
        title: 'Learn Vue',
        description: 'Master Vue.js',
        progress: 50,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }

      store.addGoal(goal)
      store.updateGoal('goal-1', { progress: 75 })

      expect(store.goals[0].progress).toBe(75)
    })

    it('should delete a goal', () => {
      const store = useCompendiumStore()
      const goal: Goal = {
        id: 'goal-1',
        title: 'Learn Vue',
        description: 'Master Vue.js',
        progress: 50,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      }

      store.addGoal(goal)
      store.deleteGoal('goal-1')

      expect(store.goals).toHaveLength(0)
    })
  })

  describe('Data Sync', () => {
    it('should load data from external source', () => {
      const store = useCompendiumStore()
      const data = {
        notes: [{ id: 'n1', title: 'Note', content: '', createdAt: '', updatedAt: '' }],
        appointments: [{ id: 'a1', title: 'Apt', date: '2026-01-20', time: '10:00', createdAt: '' }],
        goals: [{ id: 'g1', title: 'Goal', description: '', progress: 0, createdAt: '', updatedAt: '' }],
      }

      store.loadFromData(data)

      expect(store.notes).toHaveLength(1)
      expect(store.appointments).toHaveLength(1)
      expect(store.goals).toHaveLength(1)
      expect(store.lastSyncedAt).not.toBeNull()
    })

    it('should return data for save', () => {
      const store = useCompendiumStore()
      const note: QuickNote = {
        id: 'note-1',
        title: 'Test',
        content: 'Content',
        createdAt: '',
        updatedAt: '',
      }

      store.addNote(note)

      const saveData = store.getDataForSave()

      expect(saveData.notes).toHaveLength(1)
      expect(saveData.appointments).toHaveLength(0)
      expect(saveData.goals).toHaveLength(0)
    })

    it('should clear all data', () => {
      const store = useCompendiumStore()
      
      store.addNote({ id: 'n1', title: '', content: '', createdAt: '', updatedAt: '' })
      store.addAppointment({ id: 'a1', title: '', date: '', time: '', createdAt: '' })
      store.addGoal({ id: 'g1', title: '', description: '', progress: 0, createdAt: '', updatedAt: '' })

      store.clearAll()

      expect(store.notes).toHaveLength(0)
      expect(store.appointments).toHaveLength(0)
      expect(store.goals).toHaveLength(0)
      expect(store.lastSyncedAt).toBeNull()
    })
  })
})
