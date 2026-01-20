<template>
  <div class="mini-calendar">
    <div class="header">
      <button class="nav-btn" @click="previousWeek">
        <span>‹</span>
      </button>
      
      <div class="header-center" @click="$emit('openFullCalendar')">
        <h3>{{ displayMonth }}</h3>
        <span class="current-time">{{ currentTime }}</span>
      </div>
      
      <button class="nav-btn" @click="nextWeek">
        <span>›</span>
      </button>
    </div>
    
    <div class="week-container">
      <div class="week-view" :class="{ 'slide-left': slideDirection === 'left', 'slide-right': slideDirection === 'right' }">
        <div 
          v-for="day in weekDays" 
          :key="day.date"
          :class="['day', { 'current': day.isCurrent, 'has-events': day.hasAppointments || day.hasGoals }]"
          @click="$emit('selectDay', day.date)"
        >
          <span class="day-name">{{ day.name }}</span>
          <span class="day-number">{{ day.number }}</span>
          <div v-if="day.hasAppointments || day.hasGoals" class="indicators">
            <span v-if="day.hasAppointments" class="dot appointment-dot" />
            <span v-if="day.hasGoals" class="dot goal-dot" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Appointment, Goal } from '~/types'

const props = defineProps<{
  appointments: Appointment[]
  goals: Goal[]
}>()

defineEmits(['selectDay', 'openFullCalendar'])

const currentTime = ref('')
const weekOffset = ref(0)
const slideDirection = ref<'left' | 'right' | ''>('')

const baseDate = ref(new Date())

const weekDays = computed(() => {
  const today = new Date()
  const referenceDate = new Date(baseDate.value)
  referenceDate.setDate(referenceDate.getDate() + (weekOffset.value * 7))
  
  const currentDay = referenceDate.getDay()
  const days = []
  
  const startOfWeek = new Date(referenceDate)
  startOfWeek.setDate(referenceDate.getDate() - currentDay)
  
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    const hasAppointments = props.appointments.some(a => a.date === dateStr)
    const hasGoals = props.goals.some(g => g.targetDate === dateStr)
    
    days.push({
      name: dayNames[i],
      number: date.getDate(),
      date: date.toISOString(),
      isCurrent: date.toDateString() === today.toDateString(),
      hasAppointments,
      hasGoals
    })
  }
  
  return days
})

const displayMonth = computed(() => {
  const referenceDate = new Date(baseDate.value)
  referenceDate.setDate(referenceDate.getDate() + (weekOffset.value * 7))
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[referenceDate.getMonth()]} ${referenceDate.getFullYear()}`
})

const previousWeek = () => {
  slideDirection.value = 'right'
  setTimeout(() => {
    weekOffset.value--
    slideDirection.value = ''
  }, 150)
}

const nextWeek = () => {
  slideDirection.value = 'left'
  setTimeout(() => {
    weekOffset.value++
    slideDirection.value = ''
  }, 150)
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  updateTime()
  interval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.mini-calendar {
  background: #141414;
  border-radius: 16px;
  padding: 0.875rem 1rem;
  border: 1px solid #262626;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
  gap: 0.5rem;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #1f1f1f;
  color: #a3a3a3;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.nav-btn:hover {
  background: #2a2a2a;
  color: #e5e5e5;
}

.nav-btn:active {
  transform: scale(0.95);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.header-center:hover {
  background: #1f1f1f;
}

.header-center h3 {
  font-size: 0.85rem;
  font-weight: 500;
  color: #e5e5e5;
  margin: 0;
}

.current-time {
  font-size: 0.95rem;
  font-weight: 600;
  color: #3b82f6;
  font-variant-numeric: tabular-nums;
}

.week-container {
  flex: 1;
  overflow: hidden;
}

.week-view {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.375rem;
  height: 100%;
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;
}

.week-view.slide-left {
  transform: translateX(-20px);
  opacity: 0.5;
}

.week-view.slide-right {
  transform: translateX(20px);
  opacity: 0.5;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.25rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: #1f1f1f;
}

.day:hover {
  background: #2a2a2a;
}

.day.current {
  background: #3b82f6;
  color: white;
}

.day-name {
  font-size: 0.6rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day.current .day-name {
  color: rgba(255, 255, 255, 0.8);
}

.day-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e5e5;
}

.day.current .day-number {
  color: white;
}

.indicators {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.appointment-dot {
  background: #22c55e;
}

.goal-dot {
  background: #a855f7;
}

.day.current .appointment-dot {
  background: #86efac;
}

.day.current .goal-dot {
  background: #d8b4fe;
}

@media (max-width: 768px) {
  .mini-calendar {
    padding: 0.75rem 1rem;
  }
  
  .header {
    margin-bottom: 0.5rem;
  }
  
  .week-view {
    gap: 0.375rem;
  }
  
  .day {
    padding: 0.375rem 0.125rem;
    border-radius: 8px;
  }
  
  .day-name {
    font-size: 0.55rem;
  }
  
  .day-number {
    font-size: 0.8rem;
  }
  
  .indicators {
    margin-top: 4px;
  }
  
  .dot {
    width: 4px;
    height: 4px;
  }
}
</style>
