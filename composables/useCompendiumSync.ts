// Composable para sincronizar dados do Compendium com Supabase

export const useCompendiumSync = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const compendiumStore = useCompendiumStore()
  const userStore = useUserStore()

  // Helper para obter o user ID de forma segura
  async function getUserId(): Promise<string | null> {
    // Primeiro tenta do composable
    if (user.value?.id) {
      return user.value.id
    }
    
    // Fallback: busca a sessão diretamente
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id || null
  }

  // Carrega dados do usuário do Supabase
  async function loadUserData() {
    const userId = await getUserId()
    if (!userId) return false

    compendiumStore.isLoading = true

    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('data')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found (usuário novo)
        console.error('Error loading user data:', error)
        return false
      }

      if (data?.data) {
        compendiumStore.loadFromData(data.data)
      }

      return true
    } catch (e) {
      console.error('Failed to load user data:', e)
      return false
    } finally {
      compendiumStore.isLoading = false
    }
  }

  // Salva dados do usuário no Supabase
  async function saveUserData() {
    const userId = await getUserId()
    if (!userId) return false

    compendiumStore.isSaving = true

    try {
      const dataToSave = compendiumStore.getDataForSave()

      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          data: dataToSave,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Error saving user data:', error)
        return false
      }

      compendiumStore.lastSyncedAt = new Date().toISOString()
      return true
    } catch (e) {
      console.error('Failed to save user data:', e)
      return false
    } finally {
      compendiumStore.isSaving = false
    }
  }

  // Inicializa o sync quando o usuário loga
  async function initSync() {
    const userId = await getUserId()
    if (userId) {
      if (user.value) {
        userStore.setUser(user.value)
      }
      await loadUserData()
    } else {
      userStore.clearUser()
      compendiumStore.clearAll()
    }
  }

  // Logout
  async function logout() {
    await supabase.auth.signOut()
    userStore.clearUser()
    compendiumStore.clearAll()
  }

  return {
    loadUserData,
    saveUserData,
    initSync,
    logout
  }
}
