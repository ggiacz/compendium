<template>
  <div class="goals-modal-overlay" @click.self="$emit('close')">
    <div class="goals-modal">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit Goal' : 'New Goal' }}</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label for="goal-title">Title *</label>
          <input 
            id="goal-title"
            v-model="formData.title" 
            type="text"
            placeholder="E.g.: Learn Vue.js"
            maxlength="100"
            required
            autofocus
          />
        </div>
        
        <div class="form-group">
          <label for="goal-description">Description</label>
          <textarea 
            id="goal-description"
            v-model="formData.description"
            placeholder="Describe your goal..."
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="goal-progress">Progresso: {{ formData.progress }}%</label>
            <input 
              id="goal-progress"
              v-model.number="formData.progress" 
              type="range"
              min="0"
              max="100"
              step="5"
              class="progress-slider"
            />
            <div class="progress-preview">
              <div 
                class="progress-fill"
                :style="{ width: `${formData.progress}%` }"
                :class="progressClass"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="goal-target-date">Target date (optional)</label>
          <input 
            id="goal-target-date"
            v-model="formData.targetDate" 
            type="date"
          />
        </div>
        
        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? 'Save' : 'Create Goal' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Goal } from '~/types'

const props = defineProps<{
  goal?: Goal
}>()

const emit = defineEmits(['close', 'save'])

const isEditing = ref(!!props.goal)

const formData = ref({
  title: props.goal?.title || '',
  description: props.goal?.description || '',
  progress: props.goal?.progress || 0,
  targetDate: props.goal?.targetDate || ''
})

watch(() => props.goal, (newGoal) => {
  if (newGoal) {
    formData.value = {
      title: newGoal.title,
      description: newGoal.description,
      progress: newGoal.progress,
      targetDate: newGoal.targetDate || ''
    }
    isEditing.value = true
  } else {
    formData.value = { title: '', description: '', progress: 0, targetDate: '' }
    isEditing.value = false
  }
}, { immediate: true })

const progressClass = computed(() => {
  if (formData.value.progress < 30) return 'low'
  if (formData.value.progress < 70) return 'medium'
  return 'high'
})

const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    return
  }
  
  const goalData: Partial<Goal> = {
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    progress: formData.value.progress,
    targetDate: formData.value.targetDate || undefined,
    updatedAt: new Date().toISOString()
  }
  
  if (props.goal) {
    goalData.id = props.goal.id
    goalData.createdAt = props.goal.createdAt
  } else {
    goalData.id = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    goalData.createdAt = new Date().toISOString()
  }
  
  emit('save', goalData)
  emit('close')
}
</script>

<style scoped>
.goals-modal-overlay {
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

.goals-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
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

.form-row {
  display: grid;
  gap: 1rem;
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

.form-group input[type="text"],
.form-group input[type="date"],
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
  border-color: #9b59b6;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.progress-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
  margin-bottom: 1rem;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #9b59b6;
  cursor: pointer;
  transition: all 0.2s;
}

.progress-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: #8e44ad;
}

.progress-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #9b59b6;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.progress-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  background: #8e44ad;
}

.progress-preview {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease, background 0.3s ease;
}

.progress-fill.low {
  background: #e74c3c;
}

.progress-fill.medium {
  background: #f39c12;
}

.progress-fill.high {
  background: #2ecc71;
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
  background: #9b59b6;
  color: white;
}

.btn-primary:hover {
  background: #8e44ad;
  transform: translateY(-1px);
}
</style>
