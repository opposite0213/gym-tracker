import { useState, useCallback } from 'react'

const STORAGE_KEY = 'gymlog_workouts'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(load)

  const save = useCallback((next) => {
    setWorkouts(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const saveWorkout = useCallback((workout) => {
    save(prev => {
      const existing = prev.findIndex(w => w.id === workout.id)
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = workout
        return next
      }
      return [workout, ...prev]
    })
  }, [save])

  const deleteWorkout = useCallback((id) => {
    save(prev => prev.filter(w => w.id !== id))
  }, [save])

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
