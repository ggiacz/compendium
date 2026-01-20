<template>
  <div class="mini-appointments">
    <div class="header">
      <h3>Upcoming Appointments</h3>
      <button class="add-btn" title="Add appointment" @click="$emit('addAppointment')">+</button>
    </div>
    
    <div class="appointments-list">
      <div 
        v-for="appointment in sortedAppointments" 
        :key="appointment.id"
        class="appointment-item"
        @click="$emit('viewAppointment', appointment)"
      >
        <div class="appointment-time">
          <span class="date">{{ formatDate(appointment.date) }}</span>
          <span class="time">{{ appointment.time }}</span>
        </div>
        <div class="appointment-content">
          <h4>{{ appointment.title }}</h4>
          <p v-if="appointment.description">{{ appointment.description }}</p>
        </div>
        <button 
          class="delete-btn"
          title="Delete appointment"
          @click.stop="$emit('deleteAppointment', appointment.id)"
        >×</button>
      </div>
      
      <div v-if="appointments.length === 0" class="empty-state">
        <p>No appointments</p>
        <span>Click + to add one</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Appointment } from '~/types'

const props = defineProps<{
  appointments: Appointment[]
}>()

defineEmits(['addAppointment', 'deleteAppointment', 'viewAppointment'])

const sortedAppointments = computed(() => {
  return [...props.appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
  }
}
</script>

<style scoped>
.mini-appointments {
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
  background: #22c55e;
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
  background: #16a34a;
}

.appointments-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
}

.appointment-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.875rem;
  background: #1f1f1f;
  border-radius: 10px;
  transition: all 0.2s;
  border-left: 3px solid #22c55e;
  cursor: pointer;
}

.appointment-item:hover {
  background: #262626;
}

.appointment-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.appointment-time .date {
  font-size: 0.7rem;
  font-weight: 600;
  color: #22c55e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.appointment-time .time {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e5e5;
  font-variant-numeric: tabular-nums;
}

.appointment-content {
  flex: 1;
  overflow: hidden;
}

.appointment-content h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e5e5e5;
  margin: 0 0 0.25rem 0;
}

.appointment-content p {
  font-size: 0.8rem;
  color: #737373;
  margin: 0;
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
  flex-shrink: 0;
}

.appointment-item:hover .delete-btn {
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
  .mini-appointments {
    padding: 1rem;
  }
  
  .appointment-item {
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .appointment-time {
    min-width: 45px;
  }
}
</style>
