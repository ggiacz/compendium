<template>
  <div class="notes-modal-overlay" @click.self="$emit('close')">
    <div class="notes-modal">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit Note' : 'New Note' }}</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label for="note-title">Title</label>
          <input 
            id="note-title"
            v-model="formData.title" 
            type="text"
            placeholder="Enter note title..."
            maxlength="100"
            autofocus
          />
        </div>
        
        <div class="form-group">
          <label for="note-content">Content</label>
          <textarea 
            id="note-content"
            v-model="formData.content"
            placeholder="Enter note content..."
            rows="8"
          ></textarea>
        </div>
        
        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? 'Save' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { QuickNote } from '~/types'

const props = defineProps<{
  note?: QuickNote
}>()

const emit = defineEmits(['close', 'save'])

const isEditing = ref(!!props.note)

const formData = ref({
  title: props.note?.title || '',
  content: props.note?.content || ''
})

watch(() => props.note, (newNote) => {
  if (newNote) {
    formData.value = {
      title: newNote.title,
      content: newNote.content
    }
    isEditing.value = true
  } else {
    formData.value = { title: '', content: '' }
    isEditing.value = false
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!formData.value.title.trim() && !formData.value.content.trim()) {
    return
  }
  
  const noteData: Partial<QuickNote> = {
    title: formData.value.title.trim(),
    content: formData.value.content.trim(),
    updatedAt: new Date().toISOString()
  }
  
  if (props.note) {
    noteData.id = props.note.id
    noteData.createdAt = props.note.createdAt
  } else {
    noteData.id = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    noteData.createdAt = new Date().toISOString()
  }
  
  emit('save', noteData)
  emit('close')
}
</script>

<style scoped>
.notes-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.notes-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f8f9fa;
  color: #7f8c8d;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
}

.close-btn:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f8f9fa;
  color: #7f8c8d;
}

.btn-cancel:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-1px);
}
</style>
