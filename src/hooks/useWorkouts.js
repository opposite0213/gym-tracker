import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'gymlog_workouts'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
  catch (e) { console.error('保存失敗:', e) }
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(load)

  // workoutsが変わるたびに必ずlocalStorageに同期
  useEffect(() => {
    save(workouts)
  }, [workouts])

  const saveWorkout = useCallback((workout) => {
    setWorkouts(prev => {
      const existing = prev.findIndex(w => w.id === workout.id)
      return existing >= 0
        ? prev.map((w, i) => i === existing ? workout : w)
        : [workout, ...prev]
    })
  }, [])

  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id))
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
