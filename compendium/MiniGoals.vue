<template>
  <div class="mini-goals">
    <div class="header">
      <h3>Goals & Roadmap</h3>
      <button @click="$emit('addGoal')" class="add-btn" title="Add goal">+</button>
    </div>
    
    <div class="goals-list">
      <div 
        v-for="goal in goals" 
        :key="goal.id"
        class="goal-item"
        @click="$emit('editGoal', goal)"
      >
        <div class="goal-content">
          <div class="goal-header">
            <h4>{{ goal.title }}</h4>
            <span class="progress-label">{{ goal.progress }}%</span>
          </div>
          <p v-if="goal.description">{{ truncate(goal.description, 50) }}</p>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${goal.progress}%` }"
              :class="progressClass(goal.progress)"
            ></div>
          </div>
          <span v-if="goal.targetDate" class="target-date">
            Target: {{ formatDate(goal.targetDate) }}
          </span>
        </div>
        <button 
          @click.stop="$emit('deleteGoal', goal.id)"
          class="delete-btn"
          title="Delete goal"
        >×</button>
      </div>
      
      <div v-if="goals.length === 0" class="empty-state">
        <p>No goals set</p>
        <span>Click + to add one</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineProps<{
  goals: Goal[]
}>()

defineEmits(['addGoal', 'editGoal', 'deleteGoal'])

const truncate = (text: string, length: number): string => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const progressClass = (progress: number): string => {
  if (progress < 30) return 'low'
  if (progress < 70) return 'medium'
  return 'high'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.mini-goals {
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
  background: #a855f7;
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
  background: #9333ea;
}

.goals-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
}

.goal-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.875rem;
  background: #1f1f1f;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.goal-item:hover {
  background: #262626;
}

.goal-content {
  flex: 1;
  overflow: hidden;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
}

.goal-content h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e5e5e5;
  margin: 0;
}

.progress-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #a855f7;
}

.goal-content p {
  font-size: 0.8rem;
  color: #737373;
  margin: 0 0 0.5rem 0;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #262626;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.375rem;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease, background 0.3s ease;
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

.target-date {
  font-size: 0.7rem;
  color: #525252;
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

.goal-item:hover .delete-btn {
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
  .mini-goals {
    padding: 1rem;
  }
  
  .goal-item {
    padding: 0.75rem;
  }
}
</style>
