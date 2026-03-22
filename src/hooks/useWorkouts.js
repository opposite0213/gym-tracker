import { useState, useCallback } from 'react'

const STORAGE_KEY = 'gymlog_workouts'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(load)

  const saveWorkout = useCallback((workout) => {
    setWorkouts(prev => {
      const existing = prev.findIndex(w => w.id === workout.id)
      const next = existing >= 0
        ? prev.map((w, i) => i === existing ? workout : w)
        : [workout, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => {
      const next = prev.filter(w => w.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  // 種目ごとの最高重量（PR）を計算
  const getPRs = useCallback(() => {
    const prs = {}
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          const weight = parseFloat(set.weight)
          if (!weight) return
          if (!prs[ex.name] || weight > prs[ex.name].weight) {
            prs[ex.name] = { weight, date: workout.date, category: ex.category }
          }
        })
      })
    })
    return prs
  }, [workouts])

  // 直近のワークアウト（コピー用）
  const getLastWorkout = useCallback(() => {
    return workouts[0] || null
  }, [workouts])

  return { workouts, saveWorkout, deleteWorkout, getPRs, getLastWorkout }
}
