<template>
  <div class="appointments-modal-overlay" @click.self="$emit('close')">
    <div class="appointments-modal">
      <div class="modal-header">
        <h2>New Appointment</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <form class="modal-body" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="appointment-title">Title *</label>
          <input 
            id="appointment-title"
            v-model="formData.title" 
            type="text"
            placeholder="E.g.: Meeting with client"
            maxlength="100"
            required
            autofocus
          >
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="appointment-date">Date *</label>
            <input 
              id="appointment-date"
              v-model="formData.date" 
              type="date"
              required
            >
          </div>
          
          <div class="form-group">
            <label>Time *</label>
            <div class="time-selectors">
              <select v-model="formData.hour" class="time-select">
                <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
              </select>
              <span class="time-separator">:</span>
              <select v-model="formData.minute" class="time-select">
                <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="appointment-description">Description (optional)</label>
          <textarea 
            id="appointment-description"
            v-model="formData.description"
            placeholder="Add details about the appointment..."
            rows="4"
          />
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Create Appointment
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Appointment } from '~/types'

const emit = defineEmits(['close', 'save'])

const today = new Date().toISOString().split('T')[0]

// Gerar opções de hora (00-23)
const hours = computed(() => {
  return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
})

// Gerar opções de minuto em intervalos de 5 (00, 05, 10, ..., 55)
const minutes = computed(() => {
  return Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))
})

// Arredondar para o próximo intervalo de 5 minutos
const getRoundedTime = () => {
  const now = new Date()
  const hour = now.getHours().toString().padStart(2, '0')
  const mins = Math.ceil(now.getMinutes() / 5) * 5
  const minute = (mins >= 60 ? 0 : mins).toString().padStart(2, '0')
  const adjustedHour = mins >= 60 ? ((now.getHours() + 1) % 24).toString().padStart(2, '0') : hour
  return { hour: adjustedHour, minute }
}

const initialTime = getRoundedTime()

const formData = ref({
  title: '' as string,
  date: today as string,
  hour: initialTime.hour as string,
  minute: initialTime.minute as string,
  description: '' as string
})

const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    return
  }
  
  const appointmentData: Appointment = {
    id: `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: formData.value.title.trim(),
    date: formData.value.date,
    time: `${formData.value.hour}:${formData.value.minute}`,
    description: formData.value.description.trim(),
    createdAt: new Date().toISOString()
  }
  
  emit('save', appointmentData)
  emit('close')
}
</script>

<style scoped>
.appointments-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
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

.appointments-modal {
  background: #141414;
  border: 1px solid #262626;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
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
  padding: 1.25rem;
  border-bottom: 1px solid #262626;
}

.modal-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e5e5e5;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #262626;
  color: #a3a3a3;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #333;
  color: #e5e5e5;
}

.modal-body {
  padding: 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #a3a3a3;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
  background: #1f1f1f;
  color: #e5e5e5;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #22c55e;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.time-selectors {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-select {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  background: #1f1f1f;
  color: #e5e5e5;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23a3a3a3' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

.time-select:focus {
  outline: none;
  border-color: #22c55e;
}

.time-separator {
  color: #737373;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #262626;
}

.btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #262626;
  color: #a3a3a3;
}

.btn-cancel:hover {
  background: #333;
  color: #e5e5e5;
}

.btn-primary {
  background: #22c55e;
  color: white;
}

.btn-primary:hover {
  background: #16a34a;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
