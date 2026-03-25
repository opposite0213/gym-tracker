import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useWorkouts } from './hooks/useWorkouts'
import WorkoutPage from './components/WorkoutPage'
import HistoryPage from './components/HistoryPage'
import PRPage from './components/PRPage'
import StatsPage from './components/StatsPage'
import AuthPage from './components/AuthPage'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
  const [page, setPage] = useState('workout')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const { workouts, loading, saveWorkout, deleteWorkout, getPRs, getLastWorkout } = useWorkouts(user?.id)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div className="app">
      <div className="content">
        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p className="loading-text">データを読み込み中...</p>
          </div>
        ) : (
          <>
            {page === 'workout' && (
              <WorkoutPage
                saveWorkout={saveWorkout}
                getLastWorkout={getLastWorkout}
                getPRs={getPRs}
              />
            )}
            {page === 'history' && (
              <HistoryPage
                workouts={workouts}
                deleteWorkout={deleteWorkout}
              />
            )}
            {page === 'stats' && (
              <StatsPage workouts={workouts} />
            )}
            {page === 'pr' && (
              <PRPage getPRs={getPRs} />
            )}
          </>
        )}
      </div>
      <BottomNav page={page} setPage={setPage} onLogout={() => supabase.auth.signOut()} />
    </div>
  )
}
