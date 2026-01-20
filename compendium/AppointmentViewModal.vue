<template>
  <div class="appointment-view-overlay" @click.self="$emit('close')">
    <div class="appointment-view-modal">
      <div class="modal-header">
        <div class="header-info">
          <span class="badge">Appointment</span>
          <h2>{{ appointment.title }}</h2>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-body">
        <div class="info-row">
          <span class="icon">📅</span>
          <div class="info-content">
            <span class="label">Date</span>
            <span class="value">{{ formattedDate }}</span>
          </div>
        </div>
        
        <div class="info-row">
          <span class="icon">🕐</span>
          <div class="info-content">
            <span class="label">Time</span>
            <span class="value">{{ appointment.time }}</span>
          </div>
        </div>
        
        <div v-if="appointment.description" class="description-section">
          <span class="label">Description</span>
          <p class="description">{{ appointment.description }}</p>
        </div>
        
        <div v-if="!appointment.description" class="no-description">
          <span>No description added</span>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-delete" @click="handleDelete">
          Delete
        </button>
        <button class="btn btn-primary" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Appointment } from '~/types'

const props = defineProps<{
  appointment: Appointment
}>()

const emit = defineEmits(['close', 'delete'])

const formattedDate = computed(() => {
  const date = new Date(props.appointment.date + 'T12:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
})

const handleDelete = () => {
  emit('delete', props.appointment.id)
  emit('close')
}
</script>

<style scoped>
.appointment-view-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.appointment-view-modal {
  background: #141414;
  border: 1px solid #262626;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
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
  align-items: flex-start;
  padding: 1.25rem;
  border-bottom: 1px solid #262626;
}

.header-info {
  flex: 1;
}

.badge {
  display: inline-block;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.header-info h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e5e5e5;
  margin: 0;
  line-height: 1.4;
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
  flex-shrink: 0;
}

.close-btn:hover {
  background: #333;
  color: #e5e5e5;
}

.modal-body {
  padding: 1.25rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #1f1f1f;
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.info-row .icon {
  font-size: 1.25rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.info-content .label {
  font-size: 0.7rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content .value {
  font-size: 0.9rem;
  color: #e5e5e5;
  font-weight: 500;
}

.description-section {
  margin-top: 1rem;
}

.description-section .label {
  display: block;
  font-size: 0.7rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.description {
  background: #1f1f1f;
  border-radius: 10px;
  padding: 1rem;
  color: #d4d4d4;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.no-description {
  margin-top: 1rem;
  padding: 1rem;
  background: #1f1f1f;
  border-radius: 10px;
  text-align: center;
}

.no-description span {
  color: #525252;
  font-size: 0.85rem;
  font-style: italic;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem;
  border-top: 1px solid #262626;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.25);
}

.btn-primary {
  background: #22c55e;
  color: white;
}

.btn-primary:hover {
  background: #16a34a;
}
</style>
