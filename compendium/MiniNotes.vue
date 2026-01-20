<template>
  <div class="mini-notes">
    <div class="header">
      <h3>Quick Notes</h3>
      <button @click="$emit('addNote')" class="add-btn" title="Add note">+</button>
    </div>
    
    <div class="notes-list">
      <div 
        v-for="note in notes" 
        :key="note.id"
        class="note-item"
        @click="$emit('editNote', note)"
      >
        <div class="note-content">
          <h4>{{ note.title || 'Untitled' }}</h4>
          <p>{{ truncate(note.content, 60) }}</p>
        </div>
        <button 
          @click.stop="$emit('deleteNote', note.id)"
          class="delete-btn"
          title="Delete note"
        >×</button>
      </div>
      
      <div v-if="notes.length === 0" class="empty-state">
        <p>No notes yet</p>
        <span>Click + to add one</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuickNote } from '~/types'

defineProps<{
  notes: QuickNote[]
}>()

defineEmits(['addNote', 'editNote', 'deleteNote'])

const truncate = (text: string, length: number): string => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.mini-notes {
  background: #141414;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #262626;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h3 {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e5e5e5;
  margin: 0;
}

.add-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
}

.add-btn:hover {
  background: #2563eb;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
}

.note-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.875rem;
  background: #1f1f1f;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.note-item:hover {
  background: #262626;
}

.note-content {
  flex: 1;
  overflow: hidden;
}

.note-content h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e5e5e5;
  margin: 0 0 0.25rem 0;
}

.note-content p {
  font-size: 0.8rem;
  color: #737373;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: none;
  background: #dc2626;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;
  line-height: 1;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.note-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #b91c1c;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 1rem;
  text-align: center;
}

.empty-state p {
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  color: #525252;
}

.empty-state span {
  font-size: 0.8rem;
  color: #404040;
}

@media (max-width: 768px) {
  .mini-notes {
    padding: 1rem;
  }
  
  .note-item {
    padding: 0.75rem;
  }
}
</style>
