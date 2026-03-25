import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useWorkouts(userId) {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  // Supabaseからデータを取得
  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setWorkouts(data)
        setLoading(false)
      })
  }, [userId])

  const saveWorkout = useCallback(async (workout) => {
    const record = { ...workout, user_id: userId }
    const { data, error } = await supabase
      .from('workouts')
      .upsert(record, { onConflict: 'id' })
      .select()
      .single()

    if (!error && data) {
      setWorkouts(prev => {
        const exists = prev.findIndex(w => w.id === data.id)
        return exists >= 0
          ? prev.map(w => w.id === data.id ? data : w)
          : [data, ...prev]
      })
    }
  }, [userId])

  const deleteWorkout = useCallback(async (id) => {
    await supabase.from('workouts').delete().eq('id', id)
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }, [])

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

  const getLastWorkout = useCallback(() => {
    return workouts[0] || null
  }, [workouts])

  return { workouts, loading, saveWorkout, deleteWorkout, getPRs, getLastWorkout }
}
