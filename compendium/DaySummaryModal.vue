<template>
  <div class="day-summary-overlay" @click.self="$emit('close')">
    <div class="day-summary-modal">
      <div class="modal-header">
        <div class="date-info">
          <span class="day-name">{{ dayName }}</span>
          <h2>{{ formattedDate }}</h2>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-body">
        <!-- Compromissos do dia -->
        <div v-if="dayAppointments.length > 0" class="section">
          <h3>
            <span class="icon">📅</span>
            Appointments
          </h3>
          <div class="items-list">
            <div 
              v-for="appointment in dayAppointments" 
              :key="appointment.id"
              class="item appointment-item clickable"
              @click="$emit('viewAppointment', appointment)"
            >
              <span class="time">{{ appointment.time }}</span>
              <div class="item-content">
                <strong>{{ appointment.title }}</strong>
                <p v-if="appointment.description">{{ appointment.description }}</p>
              </div>
              <span class="arrow">›</span>
            </div>
          </div>
        </div>
        
        <!-- Metas com deadline no dia -->
        <div v-if="dayGoals.length > 0" class="section">
          <h3>
            <span class="icon">🎯</span>
            Goals
          </h3>
          <div class="items-list">
            <div 
              v-for="goal in dayGoals" 
              :key="goal.id"
              class="item goal-item clickable"
              @click="$emit('viewGoal', goal)"
            >
              <div class="item-content">
                <strong>{{ goal.title }}</strong>
                <div class="progress-info">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill"
                      :style="{ width: `${goal.progress}%` }"
                      :class="progressClass(goal.progress)"
                    />
                  </div>
                  <span class="progress-label">{{ goal.progress }}%</span>
                </div>
              </div>
              <span class="arrow">›</span>
            </div>
          </div>
        </div>
        
        <!-- Estado vazio -->
        <div v-if="dayAppointments.length === 0 && dayGoals.length === 0" class="empty-state">
          <p>No appointments or goals for this day</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Appointment, Goal } from '~/types'

const props = defineProps<{
  date: string
  appointments: Appointment[]
  goals: Goal[]
}>()

defineEmits(['close', 'viewAppointment', 'viewGoal'])

const selectedDate = computed(() => new Date(props.date))

const dayName = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[selectedDate.value.getDay()]
})

const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
})

const dayAppointments = computed(() => {
  const dateStr = props.date.split('T')[0]
  return props.appointments
    .filter(a => a.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time))
})

const dayGoals = computed(() => {
  const dateStr = props.date.split('T')[0]
  return props.goals.filter(g => g.targetDate === dateStr)
})

const progressClass = (progress: number): string => {
  if (progress < 30) return 'low'
  if (progress < 70) return 'medium'
  return 'high'
}
</script>

<style scoped>
.day-summary-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
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

.day-summary-modal {
  background: #141414;
  border: 1px solid #262626;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  max-height: 80vh;
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
  align-items: flex-start;
  padding: 1.25rem;
  border-bottom: 1px solid #262626;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day-name {
  font-size: 0.8rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-header h2 {
  font-size: 1.1rem;
  font-weight: 500;
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
  line-height: 1;
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

.section {
  margin-bottom: 1.5rem;
}

.section:last-child {
  margin-bottom: 0;
}

.section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #a3a3a3;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.icon {
  font-size: 1rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  background: #1f1f1f;
  border-radius: 10px;
  padding: 0.875rem;
}

.item.clickable {
  cursor: pointer;
  transition: background 0.2s;
}

.item.clickable:hover {
  background: #262626;
}

.appointment-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  border-left: 3px solid #22c55e;
}

.arrow {
  color: #525252;
  font-size: 1.25rem;
  margin-left: auto;
  align-self: center;
  transition: color 0.2s;
}

.item.clickable:hover .arrow {
  color: #a3a3a3;
}

.time {
  font-size: 0.85rem;
  font-weight: 600;
  color: #22c55e;
  min-width: 45px;
  font-variant-numeric: tabular-nums;
}

.item-content {
  flex: 1;
}

.item-content strong {
  font-size: 0.9rem;
  font-weight: 500;
  color: #e5e5e5;
  display: block;
}

.item-content p {
  font-size: 0.8rem;
  color: #737373;
  margin: 0.25rem 0 0 0;
}

.goal-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  border-left: 3px solid #a855f7;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #262626;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-fill.low {
  background: #ef4444;
}

.progress-fill.medium {
  background: #f59e0b;
}

.progress-fill.high {
  background: #22c55e;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #a855f7;
  min-width: 35px;
  text-align: right;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.empty-state p {
  font-size: 0.9rem;
  color: #525252;
}

@media (max-width: 480px) {
  .day-summary-modal {
    max-height: 90vh;
  }
  
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
}
</style>
