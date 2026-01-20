// Repository Pattern para persistência com localStorage
import type { CompendiumData } from '~/types'

const STORAGE_KEY = 'compendium_data'

export const useLocalStorage = () => {
  /**
   * Salva dados no localStorage
   */
  const save = <T>(key: string, data: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
      return false
    }
  }

  /**
   * Carrega dados do localStorage
   */
  const load = <T>(key: string, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error)
      return defaultValue
    }
  }

  /**
   * Remove dados do localStorage
   */
  const remove = (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error)
      return false
    }
  }

  /**
   * Verifica se uma chave existe no localStorage
   */
  const exists = (key: string): boolean => {
    return localStorage.getItem(key) !== null
  }

  /**
   * Limpa todos os dados do localStorage
   */
  const clear = (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error)
      return false
    }
  }

  // Métodos específicos para o Compendium
  const saveCompendiumData = (data: CompendiumData): boolean => {
    return save(STORAGE_KEY, data)
  }

  const loadCompendiumData = (): CompendiumData => {
    return load<CompendiumData>(STORAGE_KEY, {
      notes: [],
      appointments: [],
      goals: []
    })
  }

  const clearCompendiumData = (): boolean => {
    return remove(STORAGE_KEY)
  }

  return {
    // Métodos genéricos
    save,
    load,
    remove,
    exists,
    clear,
    // Métodos específicos do Compendium
    saveCompendiumData,
    loadCompendiumData,
    clearCompendiumData,
    STORAGE_KEY
  }
}
