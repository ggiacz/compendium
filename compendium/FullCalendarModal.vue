<template>
  <div class="full-calendar-overlay" @click.self="$emit('close')">
    <div class="full-calendar-modal">
      <div class="modal-header">
        <button class="nav-btn" @click="previousMonth">
          <span>‹</span>
        </button>
        
        <h2>{{ displayMonth }}</h2>
        
        <button class="nav-btn" @click="nextMonth">
          <span>›</span>
        </button>
        
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="calendar-grid">
        <div class="weekday-header">
          <span v-for="day in weekDayNames" :key="day">{{ day }}</span>
        </div>
        
        <div class="days-grid">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            :class="[
              'calendar-day',
              { 
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'has-events': day.hasAppointments || day.hasGoals
              }
            ]"
            @click="day.isCurrentMonth && selectDay(day.date)"
          >
            <span class="day-number">{{ day.number }}</span>
            <div v-if="day.hasAppointments || day.hasGoals" class="indicators">
              <span v-if="day.hasAppointments" class="dot appointment-dot" />
              <span v-if="day.hasGoals" class="dot goal-dot" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="legend">
        <div class="legend-item">
          <span class="dot appointment-dot" />
          <span>Compromissos</span>
        </div>
        <div class="legend-item">
          <span class="dot goal-dot" />
          <span>Metas</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Appointment, Goal } from '~/types'

const props = defineProps<{
  appointments: Appointment[]
  goals: Goal[]
}>()

const emit = defineEmits(['close', 'selectDay'])

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const weekDayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const displayMonth = computed(() => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[currentMonth.value]} ${currentYear.value}`
})

const calendarDays = computed(() => {
  const today = new Date()
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  
  const days = []
  
  // Dias do mês anterior para preencher a primeira semana
  const startPadding = firstDay.getDay()
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0)
  
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDay.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    days.push({
      number: prevMonthLastDay.getDate() - i,
      date: date.toISOString(),
      isCurrentMonth: false,
      isToday: false,
      hasAppointments: props.appointments.some(a => a.date === dateStr),
      hasGoals: props.goals.some(g => g.targetDate === dateStr)
    })
  }
  
  // Dias do mês atual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i)
    const dateStr = date.toISOString().split('T')[0]
    
    days.push({
      number: i,
      date: date.toISOString(),
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      hasAppointments: props.appointments.some(a => a.date === dateStr),
      hasGoals: props.goals.some(g => g.targetDate === dateStr)
    })
  }
  
  // Dias do próximo mês para completar a grid
  const endPadding = 42 - days.length // 6 semanas * 7 dias
  for (let i = 1; i <= endPadding; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i)
    const dateStr = date.toISOString().split('T')[0]
    
    days.push({
      number: i,
      date: date.toISOString(),
      isCurrentMonth: false,
      isToday: false,
      hasAppointments: props.appointments.some(a => a.date === dateStr),
      hasGoals: props.goals.some(g => g.targetDate === dateStr)
    })
  }
  
  return days
})

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDay = (date: string) => {
  emit('selectDay', date)
  emit('close')
}
</script>

<style scoped>
.full-calendar-overlay {
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

.full-calendar-modal {
  background: #141414;
  border: 1px solid #262626;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 1.25rem;
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
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.modal-header h2 {
  flex: 1;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #e5e5e5;
  margin: 0;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #1f1f1f;
  color: #a3a3a3;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #2a2a2a;
  color: #e5e5e5;
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
  margin-left: 0.5rem;
}

.close-btn:hover {
  background: #333;
  color: #e5e5e5;
}

.calendar-grid {
  margin-bottom: 1rem;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 0.5rem;
}

.weekday-header span {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 500;
  color: #525252;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.25rem 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #1f1f1f;
  position: relative;
}

.calendar-day:hover {
  background: #2a2a2a;
}

.calendar-day.other-month {
  opacity: 0.3;
  cursor: default;
}

.calendar-day.other-month:hover {
  background: #1f1f1f;
}

.calendar-day.today {
  background: #3b82f6;
}

.calendar-day.today:hover {
  background: #2563eb;
}

.calendar-day .day-number {
  font-size: 0.85rem;
  font-weight: 500;
  color: #e5e5e5;
}

.calendar-day.today .day-number {
  color: white;
  font-weight: 600;
}

.calendar-day .indicators {
  display: flex;
  gap: 3px;
  margin-top: 2px;
  position: absolute;
  bottom: 4px;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.appointment-dot {
  background: #22c55e;
}

.goal-dot {
  background: #a855f7;
}

.calendar-day.today .appointment-dot {
  background: #86efac;
}

.calendar-day.today .goal-dot {
  background: #d8b4fe;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #262626;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.legend-item span:last-child {
  font-size: 0.75rem;
  color: #737373;
}

@media (max-width: 480px) {
  .full-calendar-modal {
    padding: 1rem;
    max-width: 100%;
  }
  
  .calendar-day .day-number {
    font-size: 0.75rem;
  }
  
  .dot {
    width: 4px;
    height: 4px;
  }
}
</style>
